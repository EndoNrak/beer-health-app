#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "secrets.h"

int pin = D10;
/***** AWS IoT COre接続機能 関連プログラム *****/
WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);
unsigned long loopCount = 0;
unsigned int pubCount = 0;


// サブスクライブしているトピックを受信したときの割り込みハンドラ
void messageHandler(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, payload);
  const char* message = doc["message"]["power"];
  String message_s = String(message);
  Serial.println(message_s);
  if (message_s == "on"){
    Serial.println("on");
    digitalWrite(pin, HIGH);
  } else if (message_s == "off"){
    digitalWrite(pin, LOW);
  } else {
    Serial.println(message_s);
  }
}

void setup_Wifi(){
  // AWS IoT Coreに接続
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  // setup Wifi connection
  wl_status_t status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (status != WL_CONNECTED) {
    status = WiFi.status();
    Serial.println(
      status == WL_NO_SHIELD       ? "no shield" :
      status == WL_IDLE_STATUS     ? "idle" :
      status == WL_NO_SSID_AVAIL   ? "no ssid available" :
      status == WL_SCAN_COMPLETED  ? "scan completed" :
      status == WL_CONNECT_FAILED  ? "connect failed" :
      status == WL_CONNECTION_LOST ? "connection lost" :
      status == WL_DISCONNECTED    ? "disconnected" :
  /** status == WL_CONNECTED      */ "connected"
    );
    if (status == WL_NO_SSID_AVAIL) {
      WiFi.disconnect(true, true);
      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
      ESP.restart();
    }
    delay(500);
  }
  // IPアドレス確認用
  Serial.println("WiFi IP address: ");
  Serial.println(WiFi.localIP());
  delay(500);
}

void setup_AWS_connection(){
  // AWS IoT Coreに接続待ち
  Serial.println("Connecting to AWS IOT");
  delay(1000);

  // setup device id and mqtt topic name
  uint32_t chipId = 0;
  for(int i=0; i<17; i=i+8) {
	chipId |= ((ESP.getEfuseMac() >> (40 - i)) & 0xff) << i;
  }
  Serial.printf("ESP32 Chip model = %s Rev %d\n", ESP.getChipModel(), ESP.getChipRevision());
  Serial.printf("This chip has %d cores\n", ESP.getChipCores());
  Serial.print("Chip ID: "); Serial.println(chipId);
  String device_id = String(chipId);
  String control_topic = "beer-server/" + device_id + "/control";
  String status_topic = "beer-server/" + device_id + "/status";
  String event_topic = "beer-server/" + device_id + "/event";

  // AWS IoT Coreに接続待ち
  Serial.println("Connecting to AWS IOT");
  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(1000);
  }

  // サブスクライブしているトピックを受信したときの割り込みハンドラを指定
  client.onMessage(messageHandler);

  // サブスクライブ開始
  client.subscribe(control_topic);
  Serial.println("AWS IoT Connected!");  
  Serial.println(control_topic);
}

void setup() {
  Serial.begin(115200);
  pinMode(pin, OUTPUT);
  setup_Wifi();
  setup_AWS_connection();
}

void loop(){
  if(loopCount%(1*1*3)==0){
    pubCount++;
    Serial.println("send No."+String(pubCount));
  }
  loopCount++;
  client.loop();
	delay(1000);
}