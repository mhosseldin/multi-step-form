const formState = {
  currentStep: 1,
  personalInfo: {
    name: "",
    email: "",
    phone: "",
  },
  isMonthly: true,
  billing: "monthly",
  plan: null,
  addons: [],
  totalPrice: 0,
};

const navItems = document.querySelectorAll(".steps li");
const formEl = document.querySelector(".form-container form");
const steps = document.querySelectorAll(".form-step");

const changeBtn = document.getElementById("change-btn");
const backBtn = document.getElementById("btn-back");
const nextBtn = document.getElementById("btn-next");
const submitBtn = document.getElementById("btn-submit");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const errorMsgs = document.querySelectorAll(".error-message");

console.log(errorMsgs);

formEl.addEventListener("click", function (e) {
  if (e.target === changeBtn) {
    const isMonthly = formState.isMonthly;
    formState.isMonthly = !isMonthly;
    formState.billing = isMonthly ? "monthly" : "yearly";
  }
  if (e.target === backBtn) {
    transitionToPreviousStep(formState.currentStep);
  }
  if (e.target === nextBtn) {
    if (formState.currentStep === 1) {
      const isValid = validatePersonalInfo(
        nameInput,
        emailInput,
        phoneInput,
        errorMsgs,
      );

      if (!isValid) return;

      transitionToNextStep(formState.currentStep);
      return;
    }
  }
  if (e.target === submitBtn) {
    console.log("Submit BTN!!!!!!");
  }
});

formState.addons = getSelectedAddons(formState.billing);

function transitionToNextStep(currentStep) {
  const currentIndex = currentStep - 1;
  const nextIndex = currentIndex + 1;

  if (nextIndex >= steps.length) return;

  formState.currentStep = currentStep + 1;

  steps[currentIndex].hidden = true;
  steps[nextIndex].hidden = false;

  if (navItems[currentIndex])
    navItems[currentIndex].removeAttribute("aria-current");
  if (navItems[nextIndex])
    navItems[nextIndex].setAttribute("aria-current", "step");

  updateActionButtons();
}

function transitionToPreviousStep(currentStep) {
  const currentIndex = currentStep - 1;
  const previousIndex = currentIndex - 1;

  if (previousIndex < 0) return;

  formState.currentStep = currentStep - 1;

  steps[currentIndex].hidden = true;
  steps[previousIndex].hidden = false;

  if (navItems[currentIndex])
    navItems[currentIndex].removeAttribute("aria-current");
  if (navItems[previousIndex])
    navItems[previousIndex].setAttribute("aria-current", "step");

  updateActionButtons();
}

function updateActionButtons() {
  const isLastFormStep = formState.currentStep === 4;

  nextBtn.hidden = isLastFormStep;
  submitBtn.hidden = !isLastFormStep;

  backBtn.classList.toggle("hidden", formState.currentStep === 1);
}

function getSummaryTotalPrice(addons) {
  addonsPriceSum = 0;
  addons.forEach((addon) => (addonsPriceSum += addon.priceNum));

  return getSelectedPlanPrice + addonsPriceSum;
}

function getSummary(plan, billing, addons) {
  const planName = document.querySelector(".summary-plan .plan-name");
  const planPeriod = document.querySelector(".plan-name .plan-period");
  const planPrice = document.querySelector(".cur-plan-price");
  const summaryContainer = document.querySelector(".addons-summary");
  const totalPrice = document.querySelector(".total .total-price");

  planName.textContent = plan;
  planPeriod.textContent = billing;
  planPrice.textContent = getSelectedPlanPrice();

  addons.forEach((addon) => {
    const addonItem = document.createElement("div");
    addonItem.classList.add("addon-item");

    const addonTitle = document.createElement("dt");
    addonTitle.textContent = addon.title;

    const addonPrice = document.createElement("dd");
    addonPrice.classList.add("addon-price");
    addonPrice.textContent = addon.priceTxt;

    addonItem.appendChild(addonTitle);
    addonItem.appendChild(addonPrice);
  });
  summaryContainer.appendChild(addonItem);

  totalPrice.textContent = getSummaryTotalPrice(addons);
}

function getSelectedAddons(billing) {
  const selectedAddons = document.querySelectorAll(
    'input[name="addons"]:checked',
  );

  return Array.from(
    selectedAddons.map((addon) => {
      const card = addon.closest("addon-card");
      const title = card.querySelector(".addon-title").textContent.trim();
      const priceEl = card.querySelector(".addon-price");
      const priceTxt = priceEl.dataset[billing];
      const priceNum = Number(priceTxt.replace(/\D/g, ""));
      return {
        value: addon.value,
        title,
        priceTxt,
        priceNum,
      };
    }),
  );
}

function updateAddonsUI(billing) {
  const addonPrice = document.querySelectorAll(".addon-price");

  if (billing === "monthly") {
    addonPrice.forEach((addon) => (addon.textContent = addon.dataset.monthly));

    return;
  }

  addonPrice.forEach((addon) => (addon.textContent = addon.dataset.yearly));
}

function getSelectedPlanPrice(billing) {
  const selectedPlan = formState.plan;
  if (!selectedPlan) return 0;

  const planEl = document.getElementById(`${selectedPlan}-price`);
  if (!planEl) return 0;

  const priceStr = planEl.dataset[billing];
  return Number(priceStr.replace(/\D/g, ""));
}

function updatePlanUI(billing) {
  const planPrice = document.querySelectorAll(".plan-price");
  const planBonus = document.querySelectorAll(".plan-bonus");

  if (billing === "monthly") {
    planPrice.forEach((plan) => (plan.textContent = plan.dataset.monthly));

    planBonus.forEach((el) => (el.hidden = true));
    return;
  }

  planPrice.forEach((plan) => (plan.textContent = plan.dataset.yearly));

  planBonus.forEach((el) => (el.hidden = false));
}

function updateBilling() {
  formState.billing =
    document.querySelector('input[name="billing"]:checked')?.value ?? "monthly";
}

function validatePlanStep() {
  const selectedPlan = document.querySelector('input[name="plan"]:checked');

  if (!selectedPlan) {
    errorMsgs[3].textContent = "Please select a plan";
    return false;
  }

  errorMsgs[3].textContent = "";
  formState.plan = selectedPlan.value;
  return true;
}

function validatePersonalInfo(nameInput, emailInput, phoneInput, errorMsgs) {
  const isNameValid = validateName(nameInput, errorMsgs);
  const isEmailValid = validateEmail(emailInput, errorMsgs);
  const isPhoneValid = validatePhone(phoneInput, errorMsgs);

  return isNameValid && isEmailValid && isPhoneValid;
}

function validateName(nameInput, errorMsgs) {
  const name = nameInput.value.trim().replace(/\s+/g, " ");
  nameInput.value = name;

  if (name === "") {
    errorMsgs[0].textContent = "This field is required";
    return false;
  }

  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    errorMsgs[0].textContent = "Name must contain letters only.";
    return false;
  }

  if (name.length < 4) {
    errorMsgs[0].textContent = "Name must be at least 4 characters.";
    return false;
  }

  errorMsgs[0].textContent = "";
  formState.personalInfo.name = name;
  return true;
}

function validateEmail(emailInput, errorMsgs) {
  const email = emailInput.value.trim();

  if (email === "") {
    errorMsgs[1].textContent = "This field is required";
    return false;
  }

  if (/\s/.test(email)) {
    errorMsgs[1].textContent = "Email must not contain spaces.";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    errorMsgs[1].textContent = "Please enter a valid email address.";
    return false;
  }

  errorMsgs[1].textContent = "";
  formState.personalInfo.email = email;
  return true;
}

function validatePhone(phoneInput, errorMsgs) {
  const phone = phoneInput.value.trim();

  if (phone === "") {
    errorMsgs[2].textContent = "This field is required";
    return false;
  }

  if (/\s/.test(phone)) {
    errorMsgs[2].textContent = "Phone number must not contain spaces";
    return false;
  }

  const globalPhoneRegex = /^\+?[0-9]{8,15}$/;
  if (!globalPhoneRegex.test(phone)) {
    errorMsgs[2].textContent =
      "Please enter a valid phone number (e.g. +201012345678).";
    return false;
  }

  errorMsgs[2].textContent = "";
  formState.personalInfo.phone = phone;
  return true;
}
