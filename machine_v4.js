//ATM - Arduino Token Machine[Patent pending]
var five = require("johnny-five");
var Servo  = require("johnny-five");
var readline = require('readline-sync');
var wait = require("wait-for-stuff");
var board = new five.Board({port : "COM11"});
//All variables that require libraries initialised


var passwords = ["1111","2222","3333","4444"];
//Accepted passwords are stored in an array

board.on("ready", function(){

 

  var lcd = new five.LCD({

    controller: "PCF8574T",
   
  });
  //LCD display set initialised

  var sensor = new five.Sensor({

    pin: "A0",
     
    freq: 250,
     
    threshold:5,
     
    id: "opticalsensor"
     
  });
  //Optical sensor is initialised

  sensor.on("change", function(){

    var value = this.value;
   
  });
  //Variable to represent the sensor output with a number
//--------------------------------------------------------------------------------------

clearScreen();
setup();
//Initial state for the ATM that starts the loop of functions

//--------------------------------------------------------------------------------------
  function setup(){
    clearScreen();
    lcd.cursor(0,0).print(" Welcome to ATM                ");
    
    wait.for.time(2);
   
    loop();
  }
  //Setup for the start of the machine
  //goes in to main "loop" function
 
  function loop(){

    clearScreen();

    lcd.cursor(0,0).print("   Enter Code                ");

   //Screen cleared and message printed on 1st line of screen
    wait.for.time(1);

    var input = readline.question("Enter Code");

    //user input taken
    if(input === passwords[0] || input === passwords[1] || input === passwords[2] || input === passwords[3]){
      //if user input matches our passwords they are prompted to put a keycard in
      lcd.cursor(0,0).print(" Insert Keycard                 ");

      wait.for.time(5);

      if(sensor.value > 300){
        //the user is prompted to enter the amount of tokens required
        lcd.cursor(0,0).print("How many tokens?");
        lcd.cursor(1,0).print("                ");

        wait.for.time(5);

        dispenseToken();

        wait.for.time(3);

        var cardDetected = true;
        while(cardDetected === true){
          lcd.cursor(0,0).print("  Please remove ");
          lcd.cursor(1,0).print("      card      ");

          wait.for.time(3);

          if(sensor.value < 300){
            cardDetected = false;
          }
          //If the keycard is still in the machine it needs to be removed to progress

        }
        lcd.cursor(0,0).print(" Keycard removed ");
        lcd.cursor(1,0).print("                ");

        wait.for.time(3);

        clearScreen();
      }
      

      //if a card is put in a message is displayed and a token is given 
      else if(sensor.value < 150){
        lcd.cursor(0,0).print("   No Keycard       ");

        wait.for.time(2);

        lcd.cursor(1,0).print("                      ");

        clearScreen();
      }
      //if there is no card a different message is shown
    }
    else{
      invalidCode();
    }
    //incorrect code leads to invalidCode function
    clearScreen();
    
    setup(); 
    //screen is cleared and machine is sent back to setup state
  }

  function invalidCode(){

    clearScreen();

    lcd.cursor(0,0).print("*ACCESS DENIED!*");

    lcd.cursor(1,0).print(" *INVALID CODE* ");

    wait.for.time(3);

    clearScreen();

    setup();
  }
  //incorrect code gives a proper message and goes back to setup state

  function dispenseToken(){
    //asks for user input to get number of coins to be dispensed
    var userInput = parseInt(readline.question("How many tokens?"));
    
    //if userInput is less than or equal to zero then alert user that the amount is invalid and exit function
    if(userInput <= 0){
      lcd.cursor(0,0).print("*Invalid Amount*")
      return;
    }
    //if userInput is greater than 8 then alert the user that the maximum amount of tokens has been exceded and exit function
    else if(userInput > 8){
      lcd.cursor(0,0).print("    *Maximum*    ")
      lcd.cursor(1,0).print("*Amount Exceded*")
      return;
    }
    
    wait.for.time(3);

    lcd.cursor(0,0).print("   Thank You        ");
    lcd.cursor(1,0).print("                      ");

    var servo = new five.Servo(6);

     //loop takes user input and iterates the user defined amount of times for dispensing coins
     for(var count = 0; count < userInput ; count++){
      servo.to(46);

      wait.for.time(1);

      servo.to(0);

      wait.for.time(1);
     }
  }
  //selected amount of tokens are dispensed

  function clearScreen(){

  lcd.cursor(0,0).print("                    ");

  lcd.cursor(1,0).print("                    ");

  }
  //clears the LCD screen

})