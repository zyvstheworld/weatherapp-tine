<?php

$apiKey = "e33982ecfe56b45ce5c8f53d1252b152";

function getWeatherDataByCity($city) {
    global $apiKey;
    $url = "http://api.openweathermap.org/data/2.5/weather?q=" . urlencode($city) . "&units=metric&appid=" . $apiKey;
    return fetchWeatherData($url);
}

function getWeatherDataByCoordinates($lat, $lon) {
    global $apiKey;
    $url = "http://api.openweathermap.org/data/2.5/weather?lat=" . urlencode($lat) . "&lon=" . urlencode($lon) . "&units=metric&appid=" . $apiKey;
    return fetchWeatherData($url);
}

function getForecastDataByCity($city) {
    global $apiKey;
    $url = "http://api.openweathermap.org/data/2.5/forecast?q=" . urlencode($city) . "&units=metric&appid=" . $apiKey;
    return fetchWeatherData($url);
}

function getForecastDataByCoordinates($lat, $lon) {
    global $apiKey;
    $url = "http://api.openweathermap.org/data/2.5/forecast?lat=" . urlencode($lat) . "&lon=" . urlencode($lon) . "&units=metric&appid=" . $apiKey;
    return fetchWeatherData($url);
}

function fetchWeatherData($url) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 10
        ]
    ]);

    $response = @file_get_contents($url, false, $context);

    if ($response === false) {
        $error = error_get_last();
        return ['error' => 'Error fetching data: ' . $error['message']];
    }

    $httpCode = getHttpResponseCode($http_response_header);

    if ($httpCode !== 200) {
        return ['error' => 'HTTP error: ' . $httpCode];
    }

    $weatherData = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['error' => 'JSON decode error: ' . json_last_error_msg()];
    }

    return $weatherData;
}

function getHttpResponseCode($http_response_header) {
    if (is_array($http_response_header)) {
        $parts = explode(' ', $http_response_header[0]);
        if (count($parts) > 1) {
            return intval($parts[1]);
        }
    }
    return 0;
}
