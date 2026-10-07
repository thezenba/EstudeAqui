param (
    [int]$Port = 3333,
    [string]$Path = "$PSScriptRoot"
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
    $listener.Start()
} catch {
    $Port = 3334
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   ESTUDEAQUI - SERVIDOR OFFLINE EM EXECUCAO" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Acessando: http://localhost:$Port" -ForegroundColor Yellow
Write-Host "Pressione CTRL+C nesta janela para fechar o aplicativo." -ForegroundColor Gray
Write-Host ""

Start-Process "http://localhost:$Port"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) {
            $urlPath = "index.html"
        }

        $filePath = Join-Path $Path $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }
            $response.ContentType = $mime
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # Fallback SPA para index.html
            $indexPath = Join-Path $Path "index.html"
            if (Test-Path $indexPath -PathType Leaf) {
                $response.ContentType = "text/html; charset=utf-8"
                $bytes = [System.IO.File]::ReadAllBytes($indexPath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
            }
        }
        $response.Close()
    } catch {
        # Conexão encerrada pelo cliente
    }
}
