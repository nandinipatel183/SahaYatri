package com.practice.sevice;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class FaceMatchService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${face.api.url}")
    private String apiUrl;

    @Value("${face.api.key}")
    private String apiKey;

    @Value("${face.api.secret}")
    private String apiSecret;

    public double compareFaces(String imgUrl1, String imgUrl2) {
        try {
            // ✅ Build request body dynamically from config
            String body = "api_key=" + URLEncoder.encode(apiKey, StandardCharsets.UTF_8) +
                    "&api_secret=" + URLEncoder.encode(apiSecret, StandardCharsets.UTF_8) +
                    "&image_url1=" + URLEncoder.encode(imgUrl1, StandardCharsets.UTF_8) +
                    "&image_url2=" + URLEncoder.encode(imgUrl2, StandardCharsets.UTF_8);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object confidence = response.getBody().get("confidence");
                if (confidence != null) {
                    return Double.parseDouble(confidence.toString());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0.0;
    }
}
