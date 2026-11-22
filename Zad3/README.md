# Zadanie 3 - Aplikacja backendowa. Termin - X zajęcia

Celem zadania jest nabycie umiejętności tworzenia aplikacji serwerowych udostępniających API dla zewnętrznego klienta (będzie do napisania później).

Końcowy system powinien składać się z dwóch aplikacji. Pierwsza aplikacja (_backend_ - do zrobienia w tym zadaniu) powinna udostępniać metody API umożliwiające wykonywanie operacji na danych przechowywanych w bazie danych. Druga aplikacja (_frontend_ - do zrobienia w kolejnym zadaniu) powinna korzystać z udostępnionego API.

Zadanie można zrealizować korzystając z bazy relacyjnej lub nierelacyjnej.

Przykładowe technologie (stos z bazą relacyjną):

- baza relacyjna - PostgreSQL lub MySQL
- narzędzie do ORM - `TypeORM` lub `Prisma`
- framework backendowy - `Express.js`

Przykładowe technologie (stos z bazą nierelacyjną):

- baza nierelacyjna - MongoDB
- narzędzie do ODM - `mongoose`
- framework backendowy - `Express.js`

Dopuszczalne jest korzystanie z innych frameworków backendowych i bibliotek do obsługi baz danych. Można również obsługiwać API bez wykorzystania frameworka, korzystając bezpośrednio z możliwości Node.js.

Zalecane jest korzystanie z aktualnej wersji LTS Node.js oraz modułów ES Modules (`import`/`export`).

**UWAGA:** Niezależnie od wybranych technologii aplikacja musi zapewniać integralność danych oraz poprawną realizację wymaganej logiki biznesowej.

## Wymagania na ocenę 3

### 1. Model danych

Utwórz bazę danych umożliwiającą przechowywanie informacji o towarach i zamówieniach w sklepie internetowym.

Baza danych ma przechowywać następujące dane o poszczególnych encjach systemu (wszystkie powinny być identyfikowalne - identyfikator dowolnego typu):

- **Produkt:**
    
    - nazwa (tekst)
    - opis (tekst, może być w formie HTML)
    - cena jednostkowa (liczba dziesiętna)
    - waga jednostkowa (liczba dziesiętna)
    - kategoria towaru (jedno obowiązkowe odniesienie do encji Kategoria)
- **Kategoria:**
    
    - nazwa (tekst)
    
    Kategorie można uznać za predefiniowane, tzn. nie potrzeba API dla ich dodawania i usuwania, ale zestaw dopuszczalnych kategorii powinien znajdować się w bazie danych. Kategorie mają strukturę płaską, czyli nie ma podkategorii.
    
- **Zamówienie:**
    
    - data utworzenia (data i czas)
    - data zatwierdzenia (data i czas, dopuszczalny `null`)
    - stan zamówienia (jedno obowiązkowe odniesienie do encji Stan Zamówienia)
    - nazwa użytkownika (tekst)
    - email (tekst)
    - numer telefonu (tekst)
    - lista zamówionych towarów wraz z liczbą sztuk każdego towaru (liczba całkowita dodatnia) i ceną jednostkową towaru w danym zamówieniu
    
    Należy dodać odpowiednie tabele lub kolekcje w bazie danych. Opcjonalnie można przechowywać dodatkowe informacje, np. stawkę VAT, rabat itp.
    
- **Stan Zamówienia:**
    
    - nazwa (tekst)
    
    Predefiniowane w bazie stany:
    
    - NIEZATWIERDZONE
    - ZATWIERDZONE
    - ANULOWANE
    - ZREALIZOWANE
    
    Nazwy można przetłumaczyć na angielski.
    

**UWAGA:** Cena jednostkowa produktu w zamówieniu powinna odpowiadać cenie produktu obowiązującej w momencie składania zamówienia. Późniejsza zmiana ceny produktu nie może powodować zmiany wartości wcześniej złożonych zamówień.

Cena produktu w zamówieniu musi być ustalana na podstawie danych zapisanych w bazie, a nie wartości przesłanej przez aplikację kliencką.

### 2. Logika biznesowa

W aplikacji serwerowej zapewnij metody umożliwiające następujące operacje na bazie danych:

- **Produkt:**
    
    - pobranie kompletnej listy produktów
    - pobranie jednego produktu (po identyfikatorze)
    - dodanie produktu
    - aktualizacja produktu (dowolna właściwość poza identyfikatorem)
- **Kategoria:**
    
    - pobranie kompletnej listy kategorii
- **Zamówienie:**
    
    - pobranie listy zamówień
    - pobranie zamówień dla konkretnej nazwy użytkownika
    - pobranie jednego zamówienia (po identyfikatorze)
    - dodanie zamówienia wraz z pozycjami
    - zmiana stanu zamówienia
    - pobranie zamówień według stanu
- **Stan Zamówienia:**
    
    - pobranie kompletnej listy stanów zamówienia

Zmiana stanu zamówienia powinna podlegać walidacji.

Dopuszczalne są następujące zmiany:

- NIEZATWIERDZONE -> ZATWIERDZONE
- NIEZATWIERDZONE -> ANULOWANE
- ZATWIERDZONE -> ZREALIZOWANE
- ZATWIERDZONE -> ANULOWANE

Stany ANULOWANE i ZREALIZOWANE są stanami końcowymi. Nie można zmienić zamówienia znajdującego się w jednym z tych stanów na inny stan.

Nowo utworzone zamówienie powinno otrzymać stan NIEZATWIERDZONE. Data zatwierdzenia powinna być ustawiana przez serwer w momencie przejścia do stanu ZATWIERDZONE.

Utworzenie zamówienia wraz z jego pozycjami powinno być operacją atomową. Oznacza to, że jeżeli zapisanie którejkolwiek pozycji zamówienia zakończy się błędem, nie może pozostać w bazie częściowo zapisane zamówienie. W przypadku relacyjnych baz danych można wykorzystać do tego celu transakcje.

### 3. API

W aplikacji serwerowej zapewnij możliwość wykonania wszystkich operacji logiki biznesowej przez HTTP.

API powinno komunikować się z klientem za pomocą danych w formacie JSON.

Zalecana struktura API:

**Produkt:**

1. `GET /products` - zwraca wszystkie produkty
2. `GET /products/:id` - zwraca dane produktu o konkretnym identyfikatorze
3. `POST /products` - dodaje produkt do bazy (parametry w ciele żądania)
4. `PATCH /products/:id` - aktualizuje wskazane właściwości produktu (parametry w ciele żądania)

**Kategoria:**

1. `GET /categories` - zwraca wszystkie kategorie

**Zamówienia:**

1. `GET /orders` - zwraca wszystkie zamówienia
2. `GET /orders/:id` - zwraca zamówienie o konkretnym identyfikatorze wraz z pozycjami
3. `POST /orders` - dodaje zamówienie wraz z pozycjami (parametry w ciele żądania)
4. `PATCH /orders/:id/status` - zmienia stan zamówienia o podanym identyfikatorze
5. `GET /orders?status=id` - pobiera zamówienia o wskazanym stanie
6. `GET /orders?username=nazwa` - pobiera zamówienia wskazanego użytkownika

Parametry `status` i `username` można wykorzystywać jednocześnie.

**Stan Zamówienia:**

1. `GET /order-statuses` - zwraca wszystkie możliwe stany zamówienia

**UWAGA:** Powyższa struktura API jest zalecana, ale dopuszczalne jest zastosowanie innego nazewnictwa endpointów, o ile zachowane zostaną zasady projektowania API REST.

W szczególności należy zwrócić uwagę na poprawne wykorzystanie metod HTTP:

- `GET` - pobieranie danych
- `POST` - tworzenie zasobu
- `PUT` - zastępowanie reprezentacji zasobu
- `PATCH` - częściowa aktualizacja zasobu

### 4. Kody odpowiedzi HTTP

Zrealizuj obsługę błędów po stronie serwera. Odpowiedzi HTTP powinny zawierać kody statusów odpowiednie do wyniku wykonanej operacji.

Zalecane jest korzystanie ze stałych dla kodów statusów HTTP zamiast tzw. _magic numbers_.

Można wykorzystać np. moduł NPM `http-status-codes`.

W szczególności należy uwzględnić:

- `200 OK` - poprawne pobranie lub aktualizacja danych
- `201 Created` - poprawne utworzenie zasobu
- `400 Bad Request` - niepoprawna składnia żądania
- `404 Not Found` - wskazany zasób nie istnieje
- `409 Conflict` - operacja jest sprzeczna z aktualnym stanem zasobu, np. niedozwolona zmiana stanu zamówienia
- `422 Unprocessable Content` - dane są poprawne składniowo, ale nie spełniają wymagań walidacji
- `500 Internal Server Error` - nieoczekiwany błąd serwera

Dopuszczalne jest stosowanie innych kodów, jeżeli odpowiadają charakterowi sytuacji.

### 5. Walidacja

Wszystkie dane przesyłane przez aplikację kliencką powinny być walidowane po stronie serwera.

W szczególności należy obsłużyć poniższe błędne sytuacje:

**Produkt:**

1. Próba dodania produktu z ujemną lub zerową ceną albo wagą.
2. Próba dodania produktu z pustą nazwą lub opisem.
3. Próba dodania produktu z nieistniejącą kategorią.
4. Próba zmiany wartości pól na niewłaściwe.
5. Próba zmiany wartości pól dla nieistniejącego identyfikatora.

**Zamówienie:**

1. Próba dodania zamówienia z pustymi polami dotyczącymi użytkownika.
2. Próba dodania zamówienia z niewłaściwie wypełnionymi polami dotyczącymi użytkownika (np. niepoprawny adres email lub numer telefonu).
3. Próba dodania pustego zamówienia (bez żadnych produktów).
4. Próba dodania zamówienia z towarami, których identyfikatorów nie ma w bazie danych.
5. Próba dodania zamówienia z ujemnymi, zerowymi lub niecałkowitymi ilościami towarów.
6. Próba zmiany stanu zamówienia po jego anulowaniu lub zrealizowaniu.
7. Próba zmiany stanu zamówienia niezgodnie z dopuszczalnymi przejściami.
8. Próba aktualizacji stanu zamówienia o nieistniejącym identyfikatorze.

**UWAGA:** Nie można zakładać, że dane otrzymane od klienta są poprawne tylko dlatego, że aplikacja frontendowa wykonuje własną walidację.

#### Informowanie o błędach

Komunikaty powinny być informatywne, czyli zawierać szczegółową informację o powodzie wystąpienia problemu z wykonaniem operacji.

Zalecane jest stosowanie formatu Problem Details for HTTP APIs zgodnie z RFC 9457.

Przykładowa odpowiedź:

```
{
  "type": "about:blank",
  "title": "Unprocessable Content",
  "status": 422,
  "detail": "Cena produktu musi być większa od zera."
}
```

W przypadku błędów walidacji komunikat powinien umożliwiać rozpoznanie pola, którego dotyczy problem.

Nie należy przesyłać do klienta informacji wewnętrznych serwera, np. stosu wywołań lub danych uwierzytelniających.

### 6. Organizacja aplikacji

Kod aplikacji powinien być zorganizowany w sposób umożliwiający jego rozwijanie i testowanie.

W szczególności należy:

1. Oddzielić obsługę żądań HTTP od logiki biznesowej i operacji dostępu do danych.
2. Przechowywać parametry konfiguracyjne (np. dane dostępowe do bazy danych) poza kodem źródłowym, np. w zmiennych środowiskowych.
3. Nie umieszczać haseł, tokenów i innych danych uwierzytelniających w repozytorium.
4. Zapewnić możliwość inicjalizacji struktury bazy danych oraz danych słownikowych (kategorie, stany zamówienia).
5. Przygotować instrukcję uruchamiania aplikacji w pliku `README.md`.
6. Dołączyć przykładowy plik `.env.example`, jeżeli aplikacja korzysta ze zmiennych środowiskowych.

Nie jest wymagane stosowanie konkretnego wzorca architektonicznego (np. MVC) ani określonej struktury katalogów.

### 7. Testowanie aplikacji

Przygotuj testy automatyczne sprawdzające działanie wybranych metod API.

Można wykorzystać dowolny framework testowy, np. `node:test`, `Vitest` lub `Jest`.

Testy powinny wykonywać rzeczywiste żądania HTTP do aplikacji, a nie wyłącznie wywoływać funkcje logiki biznesowej.

Minimalny wymagany zakres:

1. Poprawne dodanie produktu.
2. Odrzucenie próby dodania produktu z niepoprawnymi danymi.
3. Poprawne utworzenie zamówienia z co najmniej dwoma różnymi produktami.
4. Odrzucenie próby utworzenia zamówienia z nieistniejącym produktem.
5. Odrzucenie niedozwolonej zmiany stanu zamówienia.
6. Sprawdzenie, że zmiana ceny produktu nie wpływa na wartość istniejącego zamówienia.

Testy powinny weryfikować nie tylko kod odpowiedzi HTTP, ale również odpowiednie dane w odpowiedzi.

**UWAGA:** Testy muszą być powtarzalne. Ich poprawne wykonanie nie powinno zależeć od danych wprowadzonych ręcznie podczas wcześniejszego korzystania z aplikacji.

---
## Wymagania dodatkowe na wyższe oceny

Każde poprawnie zrealizowane wymaganie dodatkowe zwiększa ocenę o 0,5.

### D1. Optymalizacja opisu produktu za pomocą modelu językowego

Dodaj w API dla produktów endpoint:

`POST /products/:id/seo-description`

Metoda powinna generować propozycję opisu produktu zoptymalizowanego pod kątem SEO.

Opis powinien być tworzony automatycznie przez model językowy (np. za pomocą API Groq) na podstawie danych produktu dostępnych w bazie danych.

Wymagania:

1. Do modelu należy przesłać dane produktu pobrane z bazy danych.
2. Model powinien zwrócić propozycję opisu produktu w formacie HTML.
3. Aplikacja powinna zweryfikować, czy odpowiedź modelu ma oczekiwany format.
4. Należy obsłużyć sytuację, w której komunikacja z modelem zakończy się błędem lub model nie zwróci poprawnej odpowiedzi.
5. Klucz API dostawcy modelu nie może być zapisany bezpośrednio w kodzie źródłowym.
6. Wygenerowany opis powinien zostać zwrócony do aplikacji klienckiej, ale nie powinien automatycznie zastępować dotychczasowego opisu w bazie danych.

Do komunikacji z modelem językowym można wykorzystać dowolne narzędzie, np. `fetch` lub `axios`.

**UWAGA:** Komunikacja z modelem odbywa się po stronie serwera. Aplikacja kliencka nie powinna mieć dostępu do klucza API.

Należy również pamiętać, że odpowiedź modelu językowego nie musi być poprawna. Wygenerowany HTML powinien zostać sprawdzony i odpowiednio zabezpieczony przed wykorzystaniem w aplikacji.

### D2. Uwierzytelnianie i autoryzacja

Zabezpiecz dostęp do wybranych metod API za pomocą tokenów JWT.

Zaimplementuj mechanizm uwierzytelniania użytkowników umożliwiający dostęp do zabezpieczonych metod API tylko z wykorzystaniem poprawnego tokenu JWT.

Token powinien być przesyłany w nagłówku `Authorization` w formie:

`Bearer {token}`

Zaimplementuj metodę:

`POST /login`

Metoda powinna pozwalać na uzyskanie tokenu JWT na podstawie przesłanych danych uwierzytelniających (login, hasło).

Token powinien być ważny przez określony czas, np. 1 godzinę.

**Role użytkowników:**

- KLIENT
- PRACOWNIK

Należy dodać odpowiednie encje w bazie danych do przechowywania informacji o użytkownikach i ich rolach.

Hasła użytkowników nie mogą być przechowywane w postaci jawnej. Należy wykorzystać bezpieczny mechanizm hashowania haseł, np. `argon2` lub `bcrypt`.

Przyjmij następujące zasady dostępu:

- niezalogowany użytkownik może pobierać listę produktów, kategorii i stanów zamówienia;
- KLIENT może składać zamówienia i przeglądać własne zamówienia;
- PRACOWNIK może dodawać i modyfikować produkty, przeglądać wszystkie zamówienia oraz zmieniać ich stany.

Wymagane jest zabezpieczenie API przed próbami uzyskania dostępu do zamówień innych użytkowników.

Zaimplementuj odpowiednie odpowiedzi HTTP dla sytuacji:

- `401 Unauthorized` - brak poprawnego uwierzytelnienia;
- `403 Forbidden` - użytkownik jest uwierzytelniony, ale nie ma uprawnienia do wykonania operacji.

Na potrzeby realizacji wymagania można korzystać z dowolnych bibliotek obsługujących JWT i uwierzytelnianie, np. `jsonwebtoken`, `passport`, `bcrypt`.

**UWAGA:** Mechanizm odświeżania tokenu JWT (_refresh token_) nie jest wymagany, ale można go dodatkowo zaimplementować.

### D3. Inicjalizacja towarów w bazie danych na podstawie pliku

Zaimplementuj metodę:

`POST /init`

Metoda powinna umożliwiać inicjalizację bazy danych na podstawie danych przesłanych w formacie JSON lub CSV.

Inicjalizowane są jedynie dane produktów. Kategorie powinny być dodane do bazy w inny sposób.

Wymagania:

1. W przypadku, gdy w bazie danych znajdują się już produkty, metoda powinna zwrócić odpowiedni kod błędu.
2. Zawartość przesłanych danych powinna zostać zwalidowana.
3. Jeżeli dane któregokolwiek produktu są niepoprawne, żaden produkt z przesłanego pliku nie powinien zostać dodany do bazy.
4. W przypadku poprawnego wykonania operacji metoda powinna zwrócić kod `200 OK` i informację o liczbie dodanych produktów.
5. Należy obsłużyć sytuację występowania duplikatów produktów w przesłanych danych.

Metoda powinna być zabezpieczona przed nieautoryzowanym dostępem, jeżeli realizujesz wymaganie D2 (dostęp wyłącznie dla PRACOWNIKA).

Dozwolona jest realizacja tego wymagania jako aktualizacja danych istniejących produktów w bazie sklepu, np. na podstawie wyeksportowanych danych z systemu magazynowego.

W takim przypadku należy określić sposób identyfikowania produktów oraz zachowanie aplikacji w przypadku wystąpienia konfliktów.

### D4. Dodawanie opinii po zakupie

Dodaj do API metody umożliwiające dodawanie i pobieranie opinii dotyczących procesu obsługi zamówienia.

Opinie powinny być przypisane do zamówienia, a nie do produktu.

Wymagane metody:

1. `POST /orders/:id/opinions` - dodanie opinii do zamówienia o podanym identyfikatorze.
2. `GET /orders/:id/opinions` - pobranie opinii przypisanej do zamówienia.

Opinia powinna zawierać: - ocenę (liczba całkowita z zakresu 1-5); - treść (tekst); - datę utworzenia (ustalaną przez serwer).

Przyjmij następujące zasady:

1. Opinię można dodać tylko do zamówienia, które jest ZREALIZOWANE lub ANULOWANE.
2. Do jednego zamówienia można dodać maksymalnie jedną opinię.
3. Opinia nie może zawierać pustej treści.
4. W przypadku poprawnego dodania opinii metoda powinna zwracać kod `201 Created`.
5. W przypadku niepoprawnych danych należy zwrócić odpowiedni kod błędu i informację o przyczynie błędu w formie JSON.
6. Próba ponownego dodania opinii do tego samego zamówienia powinna zakończyć się błędem `409 Conflict`.

Jeżeli realizujesz wymaganie D2, zabezpiecz metody przed nieautoryzowanym dostępem.

Opinię powinien móc dodać tylko użytkownik, który złożył zamówienie. Pracownik powinien mieć możliwość przeglądania opinii do wszystkich zamówień.

## Oddawanie zadania

Do oceny należy przedstawić działającą aplikację serwerową wraz z bazą danych.

Projekt powinien zawierać:

1. Kod źródłowy aplikacji.
2. Plik `package.json` z wymaganymi zależnościami i skryptami uruchomieniowymi.
3. Instrukcję uruchomienia aplikacji (`README.md`).
4. Mechanizm inicjalizacji struktury bazy danych i wymaganych danych słownikowych.
5. Testy automatyczne API.
6. Przykładowe dane umożliwiające sprawdzenie działania aplikacji.

Zalecane jest przygotowanie kolekcji zapytań w Postmanie lub innym podobnym narzędziu, jednak nie zastępuje ona wymaganych testów automatycznych.

### Weryfikacja postępów

Zadanie jest realizowane przez pięć kolejnych zajęć laboratoryjnych. Poza końcową weryfikacją całości zadania występuje "weryfikacja połówkowa". Na trzecie zajęcia należy przedstawić:

- połączenie z bazą danych, model danych i sposób realizacji powiązań między encjami;
- podstawowe operacje API dla produktów i kategorii;
