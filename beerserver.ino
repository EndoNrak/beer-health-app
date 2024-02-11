// // define led according to pin diagram
int pin = D10;

// void setup() {
//   // initialize digital pin led as an output
//   pinMode(pin, OUTPUT);
//   Serial.begin(115200);
// }

// void loop() {
//   if (Serial.available() > 0) {
//     String s = Serial.readStringUntil('\n');
//     if (s.startsWith("1")){
//       digitalWrite(pin, HIGH);
//     } else if (s.startsWith("0")){
//       digitalWrite(pin, LOW);
//     }
//   }
//   // digitalWrite(led, HIGH);   // turn the LED on 
//   // delay(1000);               // wait for a second
//   // digitalWrite(led, LOW);    // turn the LED off
//   // delay(1000);               // wait for a second
// }

#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"

/***** パラメータ(ご自分の環境に合わせてください) *****/
#define AWS_IOT_PUBLISH_TOPIC   "pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "sub"

/***** メインプログラム *****/
void setup() {
  Serial.begin(9600);
  pinMode(pin, OUTPUT);
  // while (!Serial);
  Serial.println("Hello!");
  // AWS IoT COre接続機能の初期化処理を実行
  setup_connection();
}
 
void loop() {
  // AWS IoT COre接続機能のループ処理を実行
  loop_connection();
}

/***** AWS IoT COre接続機能 関連プログラム *****/
WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);

unsigned int pubCount = 0;
unsigned long loopCount = 0;

// AWS IoT Core接続機能の初期化処理
void setup_connection(){
  // Wi-Fiに接続する
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  // Wi-Fiに接続待ち
  Serial.println("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println(".");

  // AWS IoT Coreに接続
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  // サブスクライブしているトピックを受信したときの割り込みハンドラを指定
  client.onMessage(messageHandler);

  // AWS IoT Coreに接続待ち
  Serial.println("Connecting to AWS IOT");
  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }
  Serial.println(".");

  if(!client.connected()){
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // サブスクライブ開始
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);

  Serial.println("AWS IoT Connected!");
}

// AWS IoT Core接続機能のループ処理
void loop_connection(){
  // 1分間隔でパブリッシュ
  if(loopCount%(1*60*10)==0){
    pubCount++;
    Serial.println("send No."+String(pubCount));
    publishMessage();
  }
  loopCount++;
  client.loop();
  delay(100);
}

// パブリッシュする
void publishMessage(){
  StaticJsonDocument<200> doc;
  doc["time"] = millis();
  doc["sensor_a0"] = analogRead(0);
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}

// サブスクライブしているトピックを受信したときの割り込みハンドラ
void messageHandler(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, payload);
  const char* message = doc["message"];
  String message_s = String(message);
  Serial.println(message_s);
  if (message_s == "on"){
    Serial.println("on");
    digitalWrite(pin, HIGH);
  } else if (message_s == "off"){
    digitalWrite(pin, LOW);
  } else {
    Serial.println("aaa");
  }

}