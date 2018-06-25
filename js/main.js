var getFaucetBalance = function(){
  $.ajax({
    url: "http://47.254.64.251:21332",
    type: "POST",
    data: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "getBalance",
      "params": [$("#faucetAddress").text()],
      "id": 1
    }),
    contentType: 'application/json',
    success: function(message) {
      $("#faucetBalance").text(message.result.tncBalance + "TNC");
    },
    error: function(message) {
    }
  });
}
var getUserBalance = function(){
  $.ajax({
    url: "http://47.254.64.251:21332",
    type: "POST",
    data: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "getBalance",
      "params": [$("#userAddress").val()],
      "id": 1
    }),
    contentType: 'application/json',
    success: function(message) {
      $("#userBalance").text(message.result.tncBalance + "TNC");
    },
    error: function(message) {
    }
  });
}
var requestFun = function(){
    $.ajax({
      url: "http://47.254.64.251:21332",
      type: "POST",
      data: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "transferTnc",
        "params": [$("#faucetAddress").text(),$("#userAddress").val()],
        "id": 1
      }),
      contentType: 'application/json',
      success: function(message) {
        console.log(message);
        if (message.result && message.result.error) {
          $(".alert-danger").html("<strong>Error!</strong> " + message.result.error);
          $(".container-danger").slideDown("slow");
        } else if (message.error) {
          $(".alert-danger").html("<strong>Error!</strong> " + message.error.message);
          $(".container-danger").slideDown("slow");
        } else {
          $("#transactions").text(message.result);
          $(".alert-success").html("<strong>Success!</strong> This transaction has been broadcast on NEO TestNet and will be show in User's balance in a shortwhile.");
          $('#requestBtn').attr('disabled',"true");
          $('#userAddress').attr('readonly',"true");
          $(".container-success").slideDown("slow");
          var startTime = new Date().getTime();
          var getUserNewBalance = setInterval(function(){
            $.ajax({
              url: "http://47.254.64.251:21332",
              type: "POST",
              data: JSON.stringify({
                "jsonrpc": "2.0",
                "method": "getBalance",
                "params": [$("#userAddress").val()],
                "id": 1
              }),
              contentType: 'application/json',
              success: function(message) {
                if (message.error) {

              }else{
                $("#userBalance").text(message.result.tncBalance + "TNC");
              }
              },
              error: function(message) {
              }
            });
            var nowTime = new Date().getTime();
            if(nowTime - startTime > 60000){
              clearInterval(getUserNewBalance);
              return;
            }
        },3000);
        }
      },
      error: function(message) {
        alert("error");
      }
    });
}
var hideAlert = function(){
  $(".container-success").hide();
  $(".container-danger").hide();
}
$("#requestBtn").click(function(){
  if($("#userAddress").val().length != 34){
    hideAlert();
    $(".alert-danger").html("<strong>Error!</strong> Address length check failed.");
    $(".container-danger").slideDown("slow");
    return false;
  } else if($("#userAddress").val() == $("#faucetAddress").text()){
    hideAlert();
    $(".alert-danger").html("<strong>Error!</strong> Address should not be same as faucet address.");
    $(".container-danger").slideDown("slow");
    return false;
  } else {
    hideAlert();
    requestFun();
  }
});
$("#userAddress").blur(function(){
  if($("#userAddress").val().length != 34){
    hideAlert();
    $(".alert-danger").html("<strong>Error!</strong> Address length check failed.");
    $(".container-danger").slideDown("slow");
    return false;
  } else {
    $(".container-danger").hide();
    // hideAlert();
    // $(".alert-info").html("<strong>Success!</strong> You can request TNC from faucet now.");
    // $(".container-info").slideDown("slow");
    getUserBalance();
  }
});
$("#userBalance").change(function(){
  getFaucetBalance();
});
// On load
$(function() {
  getFaucetBalance();
});
