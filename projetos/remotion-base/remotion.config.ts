import { Config } from "@remotion/cli/config";

// Usa o Chromium headless pré-instalado no ambiente (o download do Chrome da Remotion é bloqueado pela rede).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
