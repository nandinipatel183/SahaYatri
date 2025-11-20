package com.practice.sevice;

import com.practice.model.FoundItem;
import com.practice.model.LostItem;
import com.practice.model.ItemMatch;
import com.practice.repository.FoundItemRepository;
import com.practice.repository.LostItemRepository;
import com.practice.repository.ItemMatchRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.List;


@Service
public class ItemMatchService {

    private final FoundItemRepository foundItemRepo;
    private final LostItemRepository lostItemRepo;
    private final SmsService smsService;
    private final ItemMatchRepository itemMatchRepository;

    private static final double IMAGE_WEIGHT = 0.75;
    private static final double ATTR_WEIGHT = 0.25;
    private static final int PHASH_SIZE = 8;
    private static final int PHASH_RESIZE = 32;

    @Value("${match.items.confidence.threshold:70.0}")
    private double CONFIDENCE_THRESHOLD;

    private final HttpClient httpClient =
            HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();

    public ItemMatchService(
            FoundItemRepository foundItemRepo,
            LostItemRepository lostItemRepo,
            SmsService smsService,
            ItemMatchRepository itemMatchRepository
    ) {
        this.foundItemRepo = foundItemRepo;
        this.lostItemRepo = lostItemRepo;
        this.smsService = smsService;
        this.itemMatchRepository = itemMatchRepository;
    }

    
    // 🔥 MATCH LOST ITEM WITH ALL FOUND ITEMS
    
    @Transactional
    public void matchItemsForLost(LostItem lost) {
        if (lost == null) return;

        List<FoundItem> allFound = foundItemRepo.findAll();
        for (FoundItem found : allFound) {

            if (lost.getPhotoPaths() == null || found.getPhotoUrl() == null) continue;

            double confidence = computeConfidenceForPair(lost, found);

            if (confidence >= CONFIDENCE_THRESHOLD) {

                saveItemMatch(lost, found, confidence);

                try {
                    smsService.sendItemMatchSMS(
                            lost.getContactPhone(),
                            found.getContactPhone(),
                            found.getFoundLocation(),
                            found.getFoundTime() != null ? found.getFoundTime().toString() : "Not Provided",
                            found.getPhotoUrl(),
                            confidence
                    );
                } catch (Exception ex) {
                    System.err.println(" SMS Error: " + ex.getMessage());
                }

                // REMOVE FROM BOTH TABLES
                lostItemRepo.deleteById(lost.getId());
                foundItemRepo.deleteById(found.getId());

                System.out.println(" MATCHED ITEM REMOVED FROM TABLES");

                break; // stop matching further
            }
        }
    }

    // 🔥 MATCH FOUND ITEM WITH ALL LOST ITEMS
    
    @Transactional
    public void matchItemsForFound(FoundItem found) {
        if (found == null) return;

        List<LostItem> allLost = lostItemRepo.findAll();
        for (LostItem lost : allLost) {

            if (lost.getPhotoPaths() == null || found.getPhotoUrl() == null) continue;

            double confidence = computeConfidenceForPair(lost, found);

            if (confidence >= CONFIDENCE_THRESHOLD) {

                saveItemMatch(lost, found, confidence);

                try {
                    smsService.sendItemMatchSMS(
                            lost.getContactPhone(),
                            found.getContactPhone(),
                            found.getFoundLocation(),
                            found.getFoundTime() != null ? found.getFoundTime().toString() : "Not Provided",
                            found.getPhotoUrl(),
                            confidence
                    );
                } catch (Exception ex) {
                    System.err.println("⚠️ SMS Error: " + ex.getMessage());
                }

                // REMOVE FROM TABLES
                lostItemRepo.deleteById(lost.getId());
                foundItemRepo.deleteById(found.getId());

                System.out.println("🔥 MATCHED ITEM REMOVED FROM TABLES");

                break; // stop extra processing
            }
        }
    }

    // -------------------------------------------------------------------
    // ⭐ SAVE MATCH INTO ItemMatch TABLE (CORRECT)
    // -------------------------------------------------------------------
    private void saveItemMatch(LostItem lost, FoundItem found, double confidence) {

        ItemMatch match = ItemMatch.builder()
                .lostItemId(lost.getId())
                .foundItemId(found.getId())
                .similarity(confidence)
                .matchedLostImage(lost.getPhotoPaths())
                .matchedFoundImage(found.getPhotoUrl())
                .notified(true)
                .build();

        itemMatchRepository.save(match);
    }


    // ⭐ IMAGE + ATTRIBUTE SIMILARITY
    
    private double computeConfidenceForPair(LostItem lost, FoundItem found) {

        double imageScore = 0;

        try {
            long p1 = computePHashFromUrl(lost.getPhotoPaths());
            long p2 = computePHashFromUrl(found.getPhotoUrl());

            int hamming = hammingDistance(p1, p2);
            imageScore = ((64 - hamming) / 64.0) * 100.0;

        } catch (Exception e) {
            System.err.println("⚠️ pHash error: " + e.getMessage());
        }

        double attrScore = computeAttributeSimilarity(lost, found);

        return Math.round((IMAGE_WEIGHT * imageScore + ATTR_WEIGHT * attrScore) * 100.0) / 100.0;
    }

    private double computeAttributeSimilarity(LostItem l, FoundItem f) {
        double score = 0;

        if (safeEquals(l.getCategory(), f.getCategory())) score += 40;
        if (safeEquals(l.getColor(), f.getColor())) score += 25;
        if (safeEquals(l.getBrand(), f.getBrand())) score += 15;

        score += tokenOverlapScore(
                l.getUniqueFeatures() + " " + l.getDescription(),
                f.getUniqueFeatures() + " " + f.getDescription()
        ) * 0.20;

        return score;
    }

    private boolean safeEquals(String a, String b) {
        return a != null && b != null && a.trim().equalsIgnoreCase(b.trim());
    }

    private double tokenOverlapScore(String a, String b) {
        if (a == null || b == null) return 0;

        Set<String> sa = tokenize(a);
        Set<String> sb = tokenize(b);

        int common = 0;
        for (String w : sa) if (sb.contains(w)) common++;

        int union = sa.size() + sb.size() - common;
        return union == 0 ? 0 : (common * 100.0 / union);
    }

    private Set<String> tokenize(String s) {
        if (s == null) return Set.of();
        String[] parts = s.toLowerCase().replaceAll("[^a-z0-9 ]", " ").split("\\s+");

        Set<String> out = new HashSet<>();
        for (String p : parts) if (p.length() > 2) out.add(p);

        return out;
    }

    // ⭐ pHASH IMPLEMENTATION

    private long computePHashFromUrl(String url) throws Exception {
        byte[] bytes = fetchUrlBytes(url);
        BufferedImage img = ImageIO.read(new ByteArrayInputStream(bytes));
        return computePHash(img);
    }

    private byte[] fetchUrlBytes(String url) throws Exception {
        HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
        HttpResponse<byte[]> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofByteArray());
        return resp.body();
    }

    private long computePHash(BufferedImage src) {
        BufferedImage img = resize(src, PHASH_RESIZE, PHASH_RESIZE);

        double[][] vals = new double[PHASH_RESIZE][PHASH_RESIZE];
        for (int x = 0; x < PHASH_RESIZE; x++)
            for (int y = 0; y < PHASH_RESIZE; y++)
                vals[x][y] = luminance(img.getRGB(x, y));

        double[][] dct = applyDCT(vals);

        List<Double> list = new ArrayList<>();
        for (int i = 0; i < PHASH_SIZE; i++)
            for (int j = 0; j < PHASH_SIZE; j++)
                if (!(i == 0 && j == 0)) list.add(dct[i][j]);

        double median = median(list);

        long hash = 0;
        int bit = 0;

        for (int i = 0; i < PHASH_SIZE; i++) {
            for (int j = 0; j < PHASH_SIZE; j++) {
                if (i == 0 && j == 0) continue;
                if (dct[i][j] > median) hash |= (1L << bit);
                bit++;
            }
        }
        return hash;
    }

    private double luminance(int rgb) {
        int r = (rgb >> 16) & 255;
        int g = (rgb >> 8) & 255;
        int b = rgb & 255;
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    private BufferedImage resize(BufferedImage src, int w, int h) {
        Image tmp = src.getScaledInstance(w, h, Image.SCALE_SMOOTH);
        BufferedImage out = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);

        Graphics2D g = out.createGraphics();
        g.drawImage(tmp, 0, 0, null);
        g.dispose();

        return out;
    }

    private double[][] applyDCT(double[][] f) {
        int N = f.length;
        double[][] F = new double[N][N];

        for (int u = 0; u < N; u++) {
            for (int v = 0; v < N; v++) {

                double sum = 0;

                for (int i = 0; i < N; i++)
                    for (int j = 0; j < N; j++)
                        sum += f[i][j] *
                                Math.cos(((2 * i + 1) * u * Math.PI) / (2 * N)) *
                                Math.cos(((2 * j + 1) * v * Math.PI) / (2 * N));

                double cu = (u == 0) ? (1 / Math.sqrt(2)) : 1;
                double cv = (v == 0) ? (1 / Math.sqrt(2)) : 1;

                F[u][v] = 2.0 / N * cu * cv * sum;
            }
        }
        return F;
    }

    private double median(List<Double> list) {
        double[] arr = list.stream().mapToDouble(Double::doubleValue).toArray();
        Arrays.sort(arr);
        int m = arr.length / 2;
        return arr.length % 2 == 0 ? (arr[m - 1] + arr[m]) / 2.0 : arr[m];
    }

    private int hammingDistance(long a, long b) {
        return Long.bitCount(a ^ b);
    }
}
