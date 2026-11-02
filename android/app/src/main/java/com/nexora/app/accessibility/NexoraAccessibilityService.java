package com.nexora.app.accessibility;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.view.accessibility.AccessibilityEvent;

public class NexoraAccessibilityService extends AccessibilityService {

    private static volatile NexoraAccessibilityService instance;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;

        // Reinforce the existing limited and privacy-safe configuration.
        // Do not expand capabilities.
        AccessibilityServiceInfo info = getServiceInfo();
        if (info != null) {
            info.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED;
            info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
            info.notificationTimeout = 100;
            info.flags = AccessibilityServiceInfo.DEFAULT;
            setServiceInfo(info);
        }
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Privacy protection:
        // Do not read screen text, app names, window content,
        // passwords, OTPs, messages or other screen information.
        // No event data is collected or stored.
        if (event == null) {
            return;
        }
        // Intentionally empty – no data collection.
    }

    @Override
    public void onInterrupt() {
        // No screen data is processed.
    }

    @Override
    public void onDestroy() {
        if (instance == this) {
            instance = null;
        }
        super.onDestroy();
    }

    public static boolean isConnected() {
        return instance != null;
    }

    // Compatibility methods: return no collected screen data.
    public static String getLastPackageName() {
        return "";
    }

    public static String getLastClassName() {
        return "";
    }

    public static int getLastEventType() {
        return 0;
    }

    public static long getLastEventTime() {
        return 0L;
    }
}
