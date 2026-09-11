import { Config } from "@remotion/cli/config";

// Saida padrao: H.264 em MP4 — formato que o LinkedIn aceita nativamente.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(100);
Config.setCodec("h264");
// CRF 16 mantem gradiente e grao limpos; abaixo disso o arquivo cresce sem ganho visivel.
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
// angle e o backend GL estavel em Linux headless (container sem GPU).
Config.setChromiumOpenGlRenderer("angle");
