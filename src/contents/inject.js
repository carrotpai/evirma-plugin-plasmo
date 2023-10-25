import InjectedUrl from "url:~/injected.js";


export const config = {
  matches: ["https://www.wildberries.ru/*"],
  all_frames: true,
  run_at: 'document_start'
}

console.log(InjectedUrl)
const s = document.createElement("script")
s.src = InjectedUrl;
s.onload = function () {
  this.remove();
};

(document.head || document.documentElement).prepend(s);

