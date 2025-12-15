<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inquiry Response</title>
    <style>
        body {
            font-family: sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #005eb8;
        }
        .question, .answer {
            margin-top: 20px;
        }
        .question {
            background-color: #eef;
            padding: 15px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">We've Responded to Your Inquiry</div>
        <div class="question">
            <strong>Your Question:</strong>
            <p>{{ $inquiry->question }}</p>
        </div>
        <div class="answer">
            <strong>Our Response:</strong>
            <p>{!! nl2br(e($inquiry->answer)) !!}</p>
        </div>
    </div>
</body>
</html>
