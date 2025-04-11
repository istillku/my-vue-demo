/// <reference types="vite/client" />

// 声明 BMapGL 为全局变量
declare global {
  interface Window {
    BMapGL: any;
  }
}
export {};
