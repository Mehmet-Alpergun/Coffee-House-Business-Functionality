const form: HTMLFormElement = document.getElementById(
  "signinform"
) as HTMLFormElement;
const login: HTMLInputElement = document.getElementById(
  "login"
) as HTMLInputElement;
const password: HTMLInputElement = document.getElementById(
  "password"
) as HTMLInputElement;
const submitBtn: HTMLButtonElement = form?.querySelector(
  ".kayitolbutonu"
) as HTMLButtonElement;
[login, password].forEach((el: HTMLInputElement) => {
  el.addEventListener("blur", () => {
    const errormessage: string | null = validateField(el);
    const warningEl: HTMLElement | null = document.getElementById(
      el.id + "uyari"
    );
    if (warningEl) {
      if (errormessage) {
        warningEl.textContent = errormessage;
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
    validateForm();
  });
});

[login, password].forEach((el: HTMLElement) => {
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
function validateField(field: HTMLElement): string | null {
  if (field === login) {
    const value: string = login.value.trim();
    if (!/^[A-Za-z][A-Za-z]{2,}$/.test(value))
      return "Kullanıcı adı en az 3 karakter olmalı ve harfle başlamalıdır.";
  }

  if (field === password) {
    const value: string = password.value;
    if (!/^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/.test(value))
      return "Şifre en az 6 karakter ve 1 özel karakter içermelidir.";
  }
  return null;
}
function validateForm(): void {
  const loginError: string | null = validateField(login);
  const passwordError: string | null = validateField(password);

  if (!loginError && !passwordError) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}
form.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();
  const username: string = login.value.trim();
  const userPassword: string = password.value.trim();
  type LoginResponse = {
    data: {
      access_token: string;
      user: {
        id: number;
        login: string;
        city: string;
        street: string;
        houseNumber: number;
        paymentMethod: string;
        createdAt: string; // ISO tarih formatında string
      };
    };
    message: string;
    error?: string;
  };
  type User = {
    id: number;
    login: string;
    city: string;
    street: string;
    houseNumber: number;
    paymentMethod: string;
    createdAt: string; // ISO tarih formatında string
  };
  const resultDiv: HTMLDivElement = document.querySelector(
    ".register-result"
  ) as HTMLDivElement;
  try {
    const response: Response = await fetch(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: username,
          password: userPassword,
        }),
      }
    );

    interface Error {
      error: string;
      message: string[];
      statusCode: number;
    }
    const jsonData: LoginResponse | Error = await response.json();
    if (!response.ok) {
      const errorMessage: string =
        (jsonData as Error).error || "Incorrect login or password";
      resultDiv.classList.remove("success"); // varsa temizle
      resultDiv.classList.add("error");
      resultDiv.textContent = errorMessage;
      setTimeout(() => {
        resultDiv.classList.remove("error");
        resultDiv.textContent = "";
      }, 3000);
      return;
    }
    //const result: LoginResponse = await response.json();
    const access_token: string = (jsonData as LoginResponse).data.access_token;
    const user: User = (jsonData as LoginResponse).data.user;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log(jsonData);
    resultDiv.classList.add("success");
    resultDiv.textContent = "Sign in successful! Redirecting to Menu page...";
    form.reset(); // formu sıfırla
    submitBtn.disabled = true;
    setTimeout(() => {
      window.location.href = "menu.html";
    }, 3000);
  } catch (error) {
    console.error("Hata oluştu:", error);
    let errorMessage: string = "Bilinmeyen bir hata oluştu.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    resultDiv.classList.add("error");
    resultDiv.textContent = errorMessage;
    setTimeout(() => {
      resultDiv.classList.remove("error");
      resultDiv.textContent = "";
    }, 3000);
  }
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
