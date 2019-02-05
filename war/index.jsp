<!DOCTYPE html>
<html lang="en">

<head>
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <meta name="description" content="">
	    <meta name="author" content="">
		<meta http-equiv="Content-Security-Policy" content="script-src * data: https://ssl.gstatic.com 'unsafe-inline' 'unsafe-eval';">
		<link rel="manifest" href="manifest.webmanifest">
	    <title>Amos-Happy</title>
		<script type="text/javascript">
			var googleClientPromise = new Promise(function (resolve, reject) {
					window.resolveClient = resolve;
				}
			);
			var googlePlatformPromise = new Promise(
				function (resolve, reject) {
					window.resolvePlatform = resolve;
				}
			);
		</script>
		<script src="https://apis.google.com/js/client.js?onload=resolveClient" async></script>
		<script src="https://apis.google.com/js/platform.js?onload=resolvePlatform" async></script>

		<link rel="stylesheet" type="text/css" href="/dist/js/styles.css">

</head>

<body>
	<div id="navBar"></div>
	<div id=indexContent></div>
	<div id="modal-root"></div>
    <script src="/dist/js/index.dist.js"></script>
</body>

</html>
