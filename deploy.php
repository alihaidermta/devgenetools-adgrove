<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$secret = "mysecret123";
if ($secret === false || $secret === '') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'DEPLOY_SECRET is not configured on the server'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Prefer header (avoids query-string logging); fallback to POST then GET.
$provided = $_SERVER['HTTP_X_DEPLOY_KEY'] ?? '';
if ($provided === '') {
    $provided = is_string($_POST['key'] ?? null) ? $_POST['key'] : '';
}
if ($provided === '') {
    $provided = is_string($_GET['key'] ?? null) ? $_GET['key'] : '';
}

if ($provided === '' || !hash_equals($secret, $provided)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden'], JSON_UNESCAPED_UNICODE);
    exit;
}

$repoDir = __DIR__;
if (!@chdir($repoDir)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not change to repository directory'], JSON_UNESCAPED_UNICODE);
    exit;
}

$output = [];
$code = 0;
exec('git pull origin main 2>&1', $output, $code);

if ($code !== 0) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'git pull failed',
        'output' => implode("\n", $output),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'ok' => true,
    'message' => 'Deploy succeeded: git pull origin main completed.',
    'output' => implode("\n", $output),
], JSON_UNESCAPED_UNICODE);
