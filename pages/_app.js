import "../styles/globals.css";
import { display, body, mono } from "../lib/fonts";

export default function App({ Component, pageProps }) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
      <Component {...pageProps} />
    </div>
  );
}
