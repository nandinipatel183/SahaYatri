package com.practice.sevice;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    private boolean initialized = false;

    private void initTwilio() {
        if (!initialized) {
            Twilio.init(accountSid, authToken);
            initialized = true;
        }
    }

    // ------------------------------------------
    //  🔥 UNIVERSAL CUSTOM MESSAGE SENDER
    // ------------------------------------------
    public void sendCustomSMS(String to, String message) {
        try {
            initTwilio();

            Message.creator(
                    new com.twilio.type.PhoneNumber("+91" + to),
                    new com.twilio.type.PhoneNumber(fromPhoneNumber),
                    message
            ).create();

            System.out.println("📨 SMS sent to " + to);

        } catch (Exception e) {
            System.err.println("❌ Error sending SMS: " + e.getMessage());
        }
    }

    // ------------------------------------------
    //  🔥 CUSTOMIZED PERSON MATCH MESSAGE
    // ------------------------------------------
    public void sendPersonMatchSMS(
            String lostPhone,
            String foundPhone,
            String foundAt,
            String time,
            String imageUrl,
            double confidence
    ) {

        String msgToLost =
                "🔔 PERSON MATCH FOUND!\n\n"
                + "Someone matching your missing person has been reported.\n\n"
                + "📍 Location: " + foundAt + "\n"
                + "⏰ Time: " + time + "\n"
                + "🎯 Match Confidence: " + Math.round(confidence) + "%\n"
                + "🖼 Photo: " + imageUrl + "\n\n"
                + "📞 Finder Contact: " + foundPhone + "\n"
                + "Please contact immediately.";

        String msgToFinder =
                "📢 YOU REPORTED A PERSON WHO MATCHES A MISSING CASE!\n\n"
                + "The missing person's family may contact you.\n"
                + "📞 Family Contact: " + lostPhone + "\n\n"
                + "Thanks for helping! 🙏";

        sendCustomSMS(lostPhone, msgToLost);
        sendCustomSMS(foundPhone, msgToFinder);
    }

    // ------------------------------------------
    //  🔥 CUSTOMIZED ITEM MATCH MESSAGE
    // ------------------------------------------
    public void sendItemMatchSMS(
            String ownerPhone,
            String finderPhone,
            String location,
            String time,
            String imageUrl,
            double confidence
    ) {

        String msgToOwner =
                "🎉 ITEM MATCH FOUND!\n\n"
                + "An item matching your lost item has been reported.\n\n"
                + "📍 Found At: " + location + "\n"
                + "⏰ Time: " + time + "\n"
                + "🎯 Match Confidence: " + Math.round(confidence) + "%\n"
                + "🖼 Photo: " + imageUrl + "\n\n"
                + "📞 Finder Contact: " + finderPhone + "\n";

        String msgToFinder =
                "📢 YOU REPORTED AN ITEM THAT MATCHES A LOST REPORT!\n\n"
                + "📞 Owner Contact: " + ownerPhone + "\n"
                + "They may contact you soon.\n"
                + "Thank you for your honesty 🙏";

        sendCustomSMS(ownerPhone, msgToOwner);
        sendCustomSMS(finderPhone, msgToFinder);
    }
}
