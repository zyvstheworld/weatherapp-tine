<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once './weather/weather.php';


$requestMethod = $_SERVER['REQUEST_METHOD'];
$pathInfo = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '/';
$pathParts = explode('/', trim($pathInfo, '/'));


if ($requestMethod === 'GET') {
    switch ($pathParts[0]) {
        case 'weather':
            if (isset($pathParts[1]) && $pathParts[1] === 'city' && isset($pathParts[2])) {
                $city = urldecode($pathParts[2]);
                if (preg_match('/^[a-zA-Z\s]+$/', $city)) {
                    $data = getWeatherDataByCity($city);
                } else {
                    $data = ['error' => 'Invalid city name'];
                }
            } elseif (isset($pathParts[1]) && $pathParts[1] === 'coordinates' && isset($pathParts[2]) && isset($pathParts[3])) {
                $lat = urldecode($pathParts[2]);
                $lon = urldecode($pathParts[3]);
                $data = getWeatherDataByCoordinates($lat, $lon);
            } else {
                $data = ['error' => 'Invalid weather request'];
            }
            break;
        case 'forecast':
            if (isset($pathParts[1]) && $pathParts[1] === 'city' && isset($pathParts[2])) {
                $city = urldecode($pathParts[2]);
                if (preg_match('/^[a-zA-Z\s]+$/', $city)) {
                    $data = getForecastDataByCity($city);
                } else {
                    $data = ['error' => 'Invalid city name'];
                }
            } elseif (isset($pathParts[1]) && $pathParts[1] === 'coordinates' && isset($pathParts[2]) && isset($pathParts[3])) {
                $lat = urldecode($pathParts[2]);
                $lon = urldecode($pathParts[3]);
                $data = getForecastDataByCoordinates($lat, $lon);
            } else {
                $data = ['error' => 'Invalid forecast request'];
            }
            break;
        default:
            $data = ['error' => 'Unsupported endpoint'];
            break;
    }
} else {
    $data = ['error' => 'Unsupported request method'];
}

header('Content-Type: application/json');
echo json_encode($data);
