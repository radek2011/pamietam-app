/* Pamiętam · 50 autorskich złotych myśli. Jedna nowa przy otwarciu, bez powtórek do wyczerpania puli. */
(() => {
  'use strict';
  const THOUGHTS = [
  "Nie odkładaj dobrego słowa na wyjątkową okazję. Dziś też jest dobry dzień.",
  "Czas poświęcony bliskim nigdy nie jest stracony.",
  "Jedna krótka wiadomość potrafi skrócić bardzo długą ciszę.",
  "Najważniejsze rozmowy często zaczynają się od prostego: „Co u Ciebie?”.",
  "Pamięć o kimś najlepiej wyraża się małym gestem.",
  "Nie trzeba mieć gotowych słów, żeby dać komuś swoją uwagę.",
  "Bliskość rośnie wtedy, gdy znajdujemy na nią czas.",
  "Czasem najpiękniejszym prezentem jest telefon bez okazji.",
  "Kilka minut rozmowy może znaczyć więcej niż wiele obietnic.",
  "Dobre relacje budują się z małych, powtarzanych gestów.",
  "Nie czekaj, aż ktoś pierwszy się odezwie.",
  "Zapytaj dziś kogoś, jak naprawdę się czuje.",
  "Przyjaźń lubi spontaniczne wiadomości i szczere pytania.",
  "Kontakt nie musi być długi, żeby był ważny.",
  "Najlepszą chwilą na okazanie troski bywa zwykły dzień.",
  "Za każdym imieniem w telefonie kryje się czyjaś historia.",
  "Słuchanie to również sposób, by powiedzieć: „Jesteś dla mnie ważny”.",
  "Niektóre więzi potrzebują tylko jednego sygnału: „Pamiętam o Tobie”.",
  "To, co dla Ciebie jest minutą, dla kogoś może być ważnym momentem.",
  "Nie szukaj idealnego tematu. Zacznij od serdecznego powitania.",
  "Dbanie o relacje zaczyna się od pamiętania o drugim człowieku.",
  "Bliskim nie zawsze potrzeba rady. Czasem wystarczy obecność.",
  "Mała wiadomość może przypomnieć komuś, że nie jest sam.",
  "Dziś możesz być powodem czyjegoś uśmiechu.",
  "Relacje nie wymagają wielkich deklaracji, lecz uważności.",
  "Ciepłe słowo nie potrzebuje specjalnej daty w kalendarzu.",
  "Nie wszystko trzeba nadrobić od razu. Czasem wystarczy pierwszy kontakt.",
  "Warto pytać bliskich nie tylko o sprawy, ale i o marzenia.",
  "Telefon do kogoś bliskiego to mały sposób na bycie razem.",
  "Pamiętaj o ludziach także wtedy, gdy niczego nie potrzebujesz.",
  "Najcenniejsze wspomnienia często rodzą się ze zwyczajnych rozmów.",
  "Ważne osoby zasługują na miejsce nie tylko w pamięci, lecz także w codzienności.",
  "Nie pozwól, by „kiedyś zadzwonię” trwało zbyt długo.",
  "Jedno pytanie zadane z uwagą może otworzyć piękną rozmowę.",
  "Ciszę między rozmowami można przerwać zwykłym „Cześć”.",
  "Zainteresowanie czyimś dniem jest prostą formą troski.",
  "Przypomnienie w telefonie ma sens, gdy kończy się prawdziwym kontaktem.",
  "Nie mierz bliskości liczbą wiadomości. Liczy się także szczerość.",
  "Od czasu do czasu przypomnij komuś, za co go cenisz.",
  "Najbardziej osobista wiadomość to ta napisana z myślą o konkretnej osobie.",
  "Radość rośnie, gdy mamy z kim ją dzielić.",
  "Nawet krótka rozmowa może przywrócić poczucie bliskości.",
  "Warto pamiętać nie tylko o urodzinach, ale też o zwykłych poniedziałkach.",
  "Czasem wystarczy wspomnieć wspólną chwilę, by znów poczuć więź.",
  "Nie odkładaj podziękowania za coś dobrego, co ktoś dla Ciebie zrobił.",
  "Bliscy nie muszą zgadywać, że o nich myślisz. Możesz im to powiedzieć.",
  "Jeśli ktoś przychodzi Ci dziś na myśl, być może warto się odezwać.",
  "Zaufanie wzmacniają drobne gesty powtarzane przez lata.",
  "Dobre relacje potrzebują przestrzeni na rozmowę i na słuchanie.",
  "Najprostszy plan na dziś: przypomnieć jednej osobie, że jest ważna."
];
  const KEY = 'pamietam_thoughts_queue_v1';
  let selected = '';
  let hiddenAt = null;

  function shuffle(n) {
    const values = Array.from({length:n}, (_, i) => i);
    for (let i=n-1; i>0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [values[i],values[j]] = [values[j],values[i]];
    }
    return values;
  }
  function getState() {
    try {
      const state = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (state && Array.isArray(state.remaining) &&
          state.remaining.every(i => Number.isInteger(i) && i >= 0 && i < THOUGHTS.length) &&
          new Set(state.remaining).size === state.remaining.length &&
          (state.last === null || Number.isInteger(state.last) && state.last >= 0 && state.last < THOUGHTS.length)) {
        return state;
      }
    } catch (_) {}
    return {remaining: [], last: null};
  }
  function nextThought() {
    const state = getState();
    if (!state.remaining.length) {
      state.remaining = shuffle(THOUGHTS.length);
      if (state.last !== null && state.remaining[0] === state.last) {
        [state.remaining[0],state.remaining[1]] = [state.remaining[1],state.remaining[0]];
      }
    }
    const index = state.remaining.shift();
    state.last = index;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
    selected = THOUGHTS[index];
    display();
  }
  function display() {
    const card = document.querySelector('[data-thought-card] p');
    if (card && selected && card.textContent !== selected) card.textContent = selected;
  }
  const main = document.getElementById('app-main');
  if (main) new MutationObserver(display).observe(main, {childList:true});
  nextThought();

  /* Powrót do otwartej w tle aplikacji po co najmniej minucie traktujemy jako nowe otwarcie. */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hiddenAt = Date.now();
    else if (hiddenAt !== null) {
      const elapsed = Date.now() - hiddenAt;
      hiddenAt = null;
      if (elapsed >= 60000) nextThought();
    }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) nextThought();
  });
})();
