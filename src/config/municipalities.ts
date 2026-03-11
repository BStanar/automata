import z from "zod";

export enum BaMunicipality {
  // ── Brčko Distrikt ──────────────────────────────────────────
  Brcko = "Brčko",

  // ── Federacija BiH ──────────────────────────────────────────

  // Kanton Sarajevo
  Centar = "Centar",
  Hadzici = "Hadžići",
  Ilidza = "Ilidža",
  Ilijas = "Ilijaš",
  NoviGradSarajevo = "Novi Grad (Sarajevo)",
  NovoSarajevo = "Novo Sarajevo",
  StariGradSarajevo = "Stari Grad (Sarajevo)",
  TrnovoFBiH = "Trnovo (FBiH)",
  Vogosca = "Vogošća",

  // Una-Sanska kanton
  Bihac = "Bihać",
  BosanskakKrupa = "Bosanska Krupa",
  BosanskiPetrovac = "Bosanski Petrovac",
  Buzim = "Bužim",
  Cazin = "Cazin",
  Kljuc = "Ključ",
  SanskiMost = "Sanski Most",
  VelikaKladusa = "Velika Kladuša",


  // Posavski kanton
  DomaljevacSamac = "Domaljevac-Šamac",
  Odzak = "Odžak",
  Orasje = "Orašje",

  // Tuzlanski kanton
  Banovici = "Banovići",
  Celic = "Čelić",
  DobojIstok = "Doboj Istok",
  Gracanica = "Gračanica",
  Gradacac = "Gradačac",
  Kalesija = "Kalesija",
  Kladanj = "Kladanj",
  Lukavac = "Lukavac",
  Sapna = "Sapna",
  Srebrenik = "Srebrenik",
  Teocak = "Teočak",
  Tuzla = "Tuzla",
  Ziviniice = "Živinice",

  // Zeničko-Dobojski kanton
  Breza = "Breza",
  DobojJugFBiH = "Doboj Jug",
  Kakanj = "Kakanj",
  Maglaj = "Maglaj",
  Olovo = "Olovo",
  Tesanj = "Tešanj",
  Usora = "Usora",
  Vares = "Vareš",
  Visoko = "Visoko",
  Zavidovici = "Zavidovići",
  Zenica = "Zenica",
  Zepce = "Žepče",

  // Bosansko-Podrinjski kanton
  FocaUstikolina = "Foča-Ustikolina",
  Gorazde = "Goražde",
  PalePraca = "Pale-Prača",

  // Srednjobosanski kanton
  Bugojno = "Bugojno",
  Busovaca = "Busovača",
  Dobretici= "Dobretići",
  DonjiVakuf = "Donji Vakuf",
  Fojnica = "Fojnica",
  GornjiVakufUskoplje = "Gornji Vakuf-Uskoplje",
  Jajce = "Jajce",
  Kiseljak = "Kiseljak",
  Kresevo = "Kreševo",
  NoviTravnik = "Novi Travnik",
  Travnik = "Travnik",
  Vitez = "Vitez",

  // Hercegovačko-Neretvanski kanton
  Capljina = "Čapljina",
  Citluk = "Čitluk",
  Jablanica = "Jablanica",
  Konjic = "Konjic",
  Mostar = "Mostar",
  Neum = "Neum",
  ProzorRama = "Prozor-Rama",
  Ravno = "Ravno",
  Stolac = "Stolac",

  // Zapadnohercegovački kanton
  Grude = "Grude",
  Posusje = "Posušje",
  SirokiBrijeg = "Široki Brijeg",
  Ljubuski = "Ljubuški",

  // Kanton 10 (Livanjski)
  BosanskoeGrahovo = "Bosansko Grahovo",
  Drvar = "Drvar",
  Glamoc = "Glamoč",
  KupresFBiH = "Kupres (FBiH)",
  Tomislavgrad = "Tomislavgrad",
  Livno = "Livno",

  // ── Republika Srpska ────────────────────────────────────────
  BanjaLuka = "Banja Luka",
  Berkovici = "Berkovići",
  Bijeljina = "Bijeljina",
  Bileca = "Bileća",
  Bratunac = "Bratunac",
  Brod = "Brod",
  Cajnice = "Čajniče",
  Celinac = "Čelinac",
  Derventa = "Derventa",
  Doboj = "Doboj",
  DonjiZabar = "Donji Žabar",
  FocaRS = "Foča",
  Gacko = "Gacko",
  Gradiska = "Gradiška",
  HanPijesak = "Han Pijesak",
  IstocnaIlidza = "Istočna Ilidža",
  IstocniDrvar = "Istočni Drvar",
  IstocniMostar = "Istočni Mostar",
  IstocniStariGrad = "Istočni Stari Grad",
  IstocnoNovoSarajevo = "Istočno Novo Sarajevo",
  Jezero = "Jezero",
  Kalinovik = "Kalinovik",
  Knezevo = "Kneževo",
  Kostajnica = "Kostajnica",
  KotorVaros = "Kotor Varoš",
  KozarskaDubica = "Kozarska Dubica",
  KrupaNaUni = "Krupa na Uni",
  KupresRS = "Kupres (RS)",
  Laktasi = "Laktaši",
  Ljubinje = "Ljubinje",
  Lopare = "Lopare",
  Milici = "Milići",
  Modrica = "Modriča",
  MrkonjicGrad = "Mrkonjić Grad",
  Nevesinje = "Nevesinje",
  NoviGradRS = "Novi Grad (RS)",
  NovoGorazde = "Novo Goražde",
  Osmaci = "Osmaci",
  OstraLuka = "Oštra Luka",
  PaleRS = "Pale",
  Pelagicevo = "Pelagićevo",
  Petrovac = "Petrovac",
  Petrovo = "Petrovo",
  Prijedor = "Prijedor",
  Prnjavor = "Prnjavor",
  Ribnik = "Ribnik",
  Rogatica = "Rogatica",
  Rudo = "Rudo",
  Samac = "Šamac",
  Sekovici = "Šekovići",
  Sipovo = "Šipovo",
  Sokolac = "Sokolac",
  Srbac = "Srbac",
  Srebrenica = "Srebrenica",
  Stanari = "Stanari",
  Teslic = "Teslić",
  Trebinje = "Trebinje",
  TrnovoRS = "Trnovo",
  Ugljevik = "Ugljevik",
  Visgrad = "Višegrad",
  Vlasenica = "Vlasenica",
  Vukosavlje = "Vukosavlje",
  Zvornik = "Zvornik",
}

export const BA_MUNICIPALITIES = Object.values(BaMunicipality) as [string, ...string[]]
export type BaMunicipalityCode = (typeof BA_MUNICIPALITIES)[number]

export const municipalitySchema = z.enum(BA_MUNICIPALITIES)

export function getMunicipalityOptions(): { value: string; label: string }[] {
  return Object.values(BaMunicipality).map((name) => ({
    value: name,
    label: name,
  })).sort((a, b) => a.label.localeCompare(b.label, "bs"))
}