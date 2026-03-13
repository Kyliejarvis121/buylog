package com.buylogint.buylog;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Get the Capacitor WebView
        WebView webView = (WebView) this.getBridge().getWebView();

        // Force all links to stay in-app
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // All URLs load inside the WebView
                view.loadUrl(url);
                return true;
            }
        });

        // Optional: enable JavaScript (if your site uses it)
        webView.getSettings().setJavaScriptEnabled(true);
    }
}