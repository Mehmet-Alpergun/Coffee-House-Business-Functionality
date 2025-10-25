document.addEventListener("DOMContentLoaded", () => {
  const form: HTMLFormElement | null = document.getElementById(
    "registerForm"
  ) as HTMLFormElement | null;
  const citySelect: HTMLSelectElement | null = document.getElementById(
    "city"
  ) as HTMLSelectElement;
  const streetSelect: HTMLSelectElement | null = document.getElementById(
    "street"
  ) as HTMLSelectElement;

  const loginInput: HTMLInputElement | null = document.getElementById(
    "login"
  ) as HTMLInputElement;
  const passwordInput: HTMLInputElement | null = document.getElementById(
    "password"
  ) as HTMLInputElement;
  const confirmPasswordInput: HTMLInputElement | null = document.getElementById(
    "confirmPassword"
  ) as HTMLInputElement;
  const houseNumberInput: HTMLInputElement | null = document.getElementById(
    "houseNumber"
  ) as HTMLInputElement;
  const selectedmethod: HTMLInputElement | null = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ) as HTMLInputElement;
  const paymentMethod: string | undefined = selectedmethod?.value;

  const radioButtons: NodeListOf<HTMLInputElement> = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  // deneme yayını
  const submitButton: HTMLButtonElement = form?.querySelector(
    ".kayitolbutonu"
  ) as HTMLButtonElement;
  submitButton.disabled = true;

  // validateField fonksiyonun burada aynı kalıyor

  function checkFormValidity(): boolean {
    const fields: HTMLElement[] = [
      loginInput!,
      passwordInput!,
      confirmPasswordInput!,
      citySelect!,
      streetSelect!,
      houseNumberInput!,
    ];

    for (const field of fields) {
      const errorMessage: string | null = validateField(field);
      if (errorMessage) return false;
    }

    const paymentChecked: HTMLInputElement | null = document.querySelector(
      'input[name="paymentMethod"]:checked'
    ) as HTMLInputElement | null;
    if (!paymentChecked) return false;

    return true;
  }

  [
    loginInput,
    passwordInput,
    confirmPasswordInput,
    citySelect,
    streetSelect,
    houseNumberInput,
    ...radioButtons,
  ].forEach((el: HTMLElement) => {
    el.addEventListener("input", () => {
      submitButton.disabled = !checkFormValidity();
    });
    el.addEventListener("change", () => {
      submitButton.disabled = !checkFormValidity();
    });
  });

  //deneme yaını

  radioButtons.forEach((radio: HTMLInputElement | null) => {
    radio?.addEventListener("change", () => {
      const selected: HTMLInputElement | null = document.querySelector(
        'input[name="paymentMethod"]:checked'
      ) as HTMLInputElement | null;

      console.log("Seçilen method:", selected?.value);
    });
  });

  //validate function
  function validateField(field: HTMLElement): string | null {
    if (field === loginInput) {
      const value: string = loginInput.value.trim();
      if (!/^[A-Za-z][A-Za-z]{2,}$/.test(value))
        return "Kullanıcı adı en az 3 karakter olmalı ve harfle başlamalıdır.";
    }

    if (field === passwordInput) {
      const value: string = passwordInput.value;
      if (!/^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/.test(value))
        return "Şifre en az 6 karakter ve 1 özel karakter içermelidir.";
    }

    if (field === confirmPasswordInput) {
      if (
        confirmPasswordInput.value !== passwordInput?.value ||
        confirmPasswordInput.value == ""
      )
        return "Şifreler eşleşmiyor.";
    }

    if (field === citySelect) {
      if (!citySelect.value) return "Lütfen şehir seçiniz.";
    }

    if (field === streetSelect) {
      if (!streetSelect.value) return "Lütfen sokak seçiniz.";
    }

    if (field === houseNumberInput) {
      const num: number = Number(houseNumberInput.value);
      if (isNaN(num) || num < 2)
        return "Ev numarası 2 veya daha büyük olmalıdır.";
    }

    return null; // Hata yok
  }

  //hata verme olayı
  [
    loginInput,
    passwordInput,
    confirmPasswordInput,
    citySelect,
    streetSelect,
    houseNumberInput,
  ].forEach((el: HTMLElement) => {
    el.addEventListener("blur", () => {
      const errorMessage: string | null = validateField(el);
      const warningEl: HTMLElement | null = document.getElementById(
        el.id + "uyari"
      );
      console.log(warningEl?.textContent);
      console.log(citySelect.id);

      if (warningEl) {
        if (errorMessage) {
          warningEl.textContent = errorMessage;
          console.log(warningEl?.textContent);
          console.log(warningEl?.classList);

          warningEl.classList.add("active");
          console.log(warningEl?.classList);
          el.classList.add("active");
        } else {
          warningEl.textContent = "";
          warningEl.classList.remove("active");
        }
      }
    });
  });

  // Focus event — uyarıyı gizle
  [
    loginInput,
    passwordInput,
    confirmPasswordInput,
    citySelect,
    streetSelect,
    houseNumberInput,
  ].forEach((el: HTMLElement) => {
    el.addEventListener("focus", () => {
      const warningEl: HTMLElement | null = document.getElementById(
        el.id + "uyari"
      );
      if (warningEl) {
        warningEl.textContent = "";
        warningEl.classList.remove("active");
        el.classList.remove("active");
      }
    });
  });

  // Şehirlere göre sokaklar
  const cityStreetMap: Record<string, string[]> = {
    Istanbul: [
      "Istiklal Street",
      "Bagdat Avenue",
      "Vatan Street",
      "Tarlabasi Street",
      "Buyukdere Avenue",
      "Halaskargazi Street",
      "Barbaros Boulevard",
      "Nispetiye Street",
      "Abide-i Hurriyet Street",
      "Fevzi Cakmak Street",
    ],
    Ankara: [
      "Ataturk Boulevard",
      "Gazi Street",
      "Mevlana Boulevard",
      "Cinnah Street",
      "Tunalı Hilmi Street",
      "Ismet Inonu Boulevard",
      "Ziya Gokalp Street",
      "Sakarya Street",
      "Ulus Street",
      "Kizilay Avenue",
    ],
    Izmir: [
      "Kordon Street",
      "Cumhuriyet Boulevard",
      "Alsancak Street",
      "Gazi Boulevard",
      "Mithatpasa Street",
      "Bornova Street",
      "Buca Street",
      "Bayrakli Avenue",
      "Konak Street",
      "Karşıyaka Street",
    ],
  };

  // Şehir seçildiğinde sokakları doldur
  citySelect.addEventListener("change", () => {
    const selectedCity: string = citySelect.value;

    // Önce mevcut seçenekleri temizle
    streetSelect.innerHTML = `<option value="">Select a street</option>`;

    if (selectedCity && cityStreetMap[selectedCity]) {
      cityStreetMap[selectedCity].forEach((streetName: string) => {
        const option: HTMLOptionElement = document.createElement("option");
        option.value = streetName;
        option.textContent = streetName;
        streetSelect.appendChild(option);
      });
    }
  });

  form?.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    //sonradan eklenenler
    const login: string = loginInput.value.trim();
    const password: string = passwordInput.value;
    const confirmPassword: string = confirmPasswordInput.value;
    const city: string = citySelect.value;
    const street: string = streetSelect.value;
    const houseNumber: number = Number(houseNumberInput.value);

    if (
      !login ||
      !password ||
      !confirmPassword ||
      !city ||
      !street ||
      !houseNumber ||
      !paymentMethod
    ) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    //login doğrulama
    const loginRegex: RegExp = /^[A-Za-z][A-Za-z]{2,}$/;
    if (!loginRegex.test(login)) {
      alert(
        "Kullanıcı adı en az 3 karakter olmalı, harfle başlamalı ve sadece İngilizce harfler içermelidir."
      );
      return;
    }
    //password and confirm password
    const passwordRegex: RegExp =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Şifre en az 6 karakter uzunluğunda olmalı ve en az 1 özel karakter içermelidir."
      );
      return;
    }

    // 2. Şart: Şifreler birebir aynı olmalı (case-sensitive)
    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor. Lütfen aynı şifreyi tekrar girin.");
      return;
    }

    // city
    if (city === "") {
      alert("Lütfen bir şehir seçin.");
      return;
    }
    //street
    if (street === "") {
      alert("Lütfen bir sokak seçin.");
      return;
    }

    // house number
    if (isNaN(houseNumber) || houseNumber < 2) {
      alert("House Number must be a number greater than or equal to 2.");
      return;
    }
    const apiUrl: string =
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register";
    interface Payload {
      login: string;
      password: string;
      confirmPassword: string;
      city: string;
      street: string;
      houseNumber: number;
      paymentMethod?: string;
    }
    const payload: Payload = {
      login,
      password,
      confirmPassword,
      city,
      street,
      houseNumber,
      paymentMethod,
    };
    const resultDiv: HTMLDivElement = document.querySelector(
      ".register-result"
    ) as HTMLDivElement;
    try {
      const response: Response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      interface ErrorResponse {
        error: string;
      }
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        console.error("API Hatası:", errorData);
        throw new Error(
          "Kayıt başarısız: " + (errorData.error || response.statusText)
        );
      }
      interface SuccessResponse {
        data: Record<string, unknown>; // veya data'nın yapısına göre daha spesifik tip
        message: string;
        error?: string; // bazen hata bilgisi olabilir ama başarılıysa genelde boş
      }

      const data: SuccessResponse = await response.json();
      console.log(data);
      // Başarılıysa localStorage'a kaydet
      //localStorage.setItem("user", JSON.stringify(data));
      resultDiv.classList.add("success");
      resultDiv.textContent =
        "Registration successful! Redirecting to login page...";
      form.reset(); // formu sıfırla
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 3000);
    } catch (error) {
      console.error("Hata oluştu:", error);
      let errorMessage: string = "Bilinmeyen bir hata oluştu.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      alert("Bir hata oluştu: " + error);
      resultDiv.classList.add("error");
      resultDiv.textContent = errorMessage;
    }
  });
});

const cartagit: HTMLAnchorElement | null = document.querySelector(".cartagit");
const carsayisi: HTMLSpanElement | null = document.querySelector(".carsayisi");
interface User {
  id: number;
  login: string;
  paymentMethod: string;
  street: string;
  houseNumber: number;
  city: string;
  createdAt: string;
}
function isUserLoggedIn(): User | null {
  const userString: string | null = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  return user;
}
const user: User | null = isUserLoggedIn();
function getSelectedProducts(): Product[] {
  const user: User | null = isUserLoggedIn();
  console.log(user);
  const data: string | null = localStorage.getItem("selectedProducts");
  if (!data) return [];
  try {
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error("LocalStorage parse hatası:", error);
    return [];
  }
}
interface Product {
  id: number;
  name: string;
  originalPrice: string;
  size: number;
  discountedPrice: string;
  additives: string[];
  quantity: number;
  // başka alanlar da olabilir
  category: string;
}

const urunler: Product[] = getSelectedProducts();
if (user) {
  cartagit?.classList.add("active");
  if (urunler.length > 0) {
    carsayisi!.textContent = urunler.length.toString();
  }
} else {
  if (urunler.length > 0) {
    cartagit?.classList.add("active");
    carsayisi!.textContent = urunler.length.toString();
  }
}
