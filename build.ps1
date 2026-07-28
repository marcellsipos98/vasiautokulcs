$localNode = Get-Command node -ErrorAction SilentlyContinue
$fallbackNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if ($localNode) {
    $nodePath = $localNode.Source
} elseif (Test-Path $fallbackNode) {
    $nodePath = $fallbackNode
} else {
    throw "Node.js nem található. Telepíts Node-ot, vagy futtasd Codex runtime környezetből."
}

& $nodePath "$PSScriptRoot\scripts\build-site.mjs"
