package app.noname.pocket;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.webkit.*;
import android.view.View;
import androidx.webkit.WebViewAssetLoader;
import java.io.IOException;
import java.util.HashMap;

public class MainActivity extends Activity {
 private WebView web;
 private ValueCallback<Uri[]> fileChoice;
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
  final WebViewAssetLoader loader = new WebViewAssetLoader.Builder().addPathHandler("/", path -> {
   try {
    String name = path.isEmpty() ? "index.html" : path;
    String ext = name.substring(name.lastIndexOf('.') + 1);
    String mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
    if (ext.equals("js") || ext.equals("mjs")) mime = "text/javascript";
    if (ext.equals("ts")) mime = "video/mp2t";
    if (ext.equals("json")) mime = "application/json";
    WebResourceResponse response = new WebResourceResponse(mime == null ? "application/octet-stream" : mime,"UTF-8",getAssets().open(name));
    HashMap<String,String> headers = new HashMap<>(); headers.put("Access-Control-Allow-Origin","https://appassets.androidplatform.net"); response.setResponseHeaders(headers);
    return response;
   } catch (IOException e) { return null; }
  }).build();
  ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
   @Override public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) { return loader.shouldInterceptRequest(request.getUrl()); }
  });
  web = new WebView(this);
  web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true); web.getSettings().setDatabaseEnabled(true); web.getSettings().setMediaPlaybackRequiresUserGesture(false);
  web.setWebViewClient(new WebViewClient(){ @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){return loader.shouldInterceptRequest(request.getUrl());} });
  web.setWebChromeClient(new WebChromeClient(){
   @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params){
    if(fileChoice!=null)fileChoice.onReceiveValue(null); fileChoice=callback;
    Intent intent=params.createIntent();startActivityForResult(intent,42);return true;
   }
   @Override public boolean onJsAlert(WebView view,String url,String message,JsResult result){new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton("确定",(d,w)->result.confirm()).setOnCancelListener(d->result.cancel()).show();return true;}
   @Override public boolean onJsConfirm(WebView view,String url,String message,JsResult result){new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton("确定",(d,w)->result.confirm()).setNegativeButton("取消",(d,w)->result.cancel()).setOnCancelListener(d->result.cancel()).show();return true;}
  });
  setContentView(web); web.loadUrl("https://appassets.androidplatform.net/index.html");
 }
 @Override protected void onPause(){super.onPause();web.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override protected void onDestroy(){web.destroy();super.onDestroy();}
 @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);if(request==42&&fileChoice!=null){fileChoice.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result,data));fileChoice=null;}}
 @Override public void onBackPressed(){new AlertDialog.Builder(this).setMessage("退出无名杀？").setPositiveButton("退出",(d,w)->finish()).setNegativeButton("继续游戏",null).show();}
}
