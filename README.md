# Queue-send-email-vtiger-crm
When must to send a lot of emails

# Installation
npm install<br>
npm start

# How to use?

```php
//Using post file and data with curl php
$cURL = curl_init("http://localhost:3000/insertqueue");
$arr = array(
	array(
		'to' => 'sentToEmail', 
		'subject' => 'TEST', 
		'text' => '', 
		'html' => 'This is email test', 
		'replyTo' => '', 
		'cc' => '', 
		'bcc' => ''
	),
	array(
		'to' => 'sentToEmail', 
		'subject' => 'TEST2', 
		'text' => '', 
		'html' => 'This is email test', 
		'replyTo' => '', 
		'cc' => '', 
		'bcc' => ''
	)
);
$fields = [
   new \CurlFile($pathFile, $nameFile),
   new \CurlFile($pathFile, $nameFile),
   //...
	'data' => json_encode($arr)//post name data
];
curl_setopt($cURL, CURLOPT_POSTFIELDS, $fields);
$response = curl_exec($cURL);
curl_close($cURL);

