int buzzer = 8;
String str;
bool beep;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // send an intro:
  Serial.println("Hi, please send a beep 1| 1000");
  Serial.println();
  
  pinMode(buzzer, OUTPUT);
  beep = true;
}

void loop() {
  if (Serial.available() > 0){

    String first  = Serial.readStringUntil('+');
    Serial.read();
    String second  = Serial.readStringUntil('\0');
    
    /// Parse strings to int
    int beep = first.toInt();
    int duration = second.toInt();
    
    Serial.print(duration);
    if(beep == 1){
      tone(buzzer, 1000, duration);
      delay (duration); 
      noTone(8);
    }
  }
  
}
