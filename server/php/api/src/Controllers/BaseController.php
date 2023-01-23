<?php

class BaseController {
    public function __call($name, $arguments)
    {
        $this->sendOutput('Incorrect URL', 404);
    }

    protected function getUriSegments()
    {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode( '/', $uri );
        return $uri;
    }

    protected function sendOutput($data, $code)
    {
        http_response_code($code);
        echo $data;
        exit;
    }
}