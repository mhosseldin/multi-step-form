const formState = {
  currentStep: 1,
  personalInfo: {
    name: "",
    email: "",
    phone: "",
  },
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

const billingInputs = document.querySelectorAll('input[name="billing"]');

billingInputs.forEach((input) => {
  input.addEventListener("change", function () {
    formState.billing = this.value;
    render(formState);
  });
});

formEl.addEventListener("click", function (e) {
  if (e.target === changeBtn) {
    formState.currentStep = 2;
    updateStepVisibility(3, 1);
    render(formState);
    return;
  }

  if (e.target === backBtn) {
    transitionToPreviousStep(formState.currentStep);
    return;
  }

  if (e.target === nextBtn) {
    handleNextStep();
    return;
  }

  if (e.target === submitBtn) {
    handleSubmit();
    return;
  }
});

function handleNextStep() {
  const currentStep = formState.currentStep;

  if (currentStep === 1) {
    const isValid = validatePersonalInfo();
    if (!isValid) return;
    transitionToNextStep(currentStep);
  } else if (currentStep === 2) {
    const isValid = validatePlanStep();
    if (!isValid) return;
    transitionToNextStep(currentStep);
  } else if (currentStep === 3) {
    formState.addons = getSelectedAddons(formState.billing);
    transitionToNextStep(currentStep);
  }
}

function handleSubmit() {
  if (submitBtn.disabled) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  setTimeout(() => {
    console.log("Submitting Data:", formState);

    formState.currentStep = 5;
    updateStepVisibility(3, 4);

    submitBtn.disabled = false;
    submitBtn.textContent = "Confirm";
  }, 1000);
}

function transitionToNextStep(currentStep) {
  const nextIndex = currentStep;
  if (nextIndex >= steps.length) return;

  formState.currentStep = currentStep + 1;
  updateStepVisibility(currentStep - 1, nextIndex);

  render(formState);
}

function transitionToPreviousStep(currentStep) {
  const prevIndex = currentStep - 2;
  if (prevIndex < 0) return;

  formState.currentStep = currentStep - 1;
  updateStepVisibility(currentStep - 1, prevIndex);

  render(formState);
}

function updateStepVisibility(hideIndex, showIndex) {
  steps[hideIndex].hidden = true;
  steps[showIndex].hidden = false;

  if (navItems[hideIndex]) navItems[hideIndex].removeAttribute("aria-current");
  if (navItems[showIndex])
    navItems[showIndex].setAttribute("aria-current", "step");

  updateActionButtons();

  const newStepHeading = steps[showIndex].querySelector(".step-title");
  if (newStepHeading) {
    newStepHeading.setAttribute("tabindex", "-1");
    newStepHeading.focus();
  }
}

function updateActionButtons() {
  const isLastFormStep = formState.currentStep === 4;
  const isThankYouStep = formState.currentStep === 5;

  nextBtn.hidden = isLastFormStep || isThankYouStep;
  submitBtn.hidden = !isLastFormStep;
  backBtn.classList.toggle(
    "hidden",
    formState.currentStep === 1 || isThankYouStep,
  );
}

function getSelectedAddons(billing) {
  const selectedAddons = Array.from(
    document.querySelectorAll('input[name="addons"]:checked'),
  );

  return selectedAddons.map((addon) => {
    const card = addon.closest(".addon-card");
    const title = card.querySelector(".addon-title").textContent.trim();
    const priceEl = card.querySelector(".addon-price");
    const priceTxt = priceEl.dataset[billing];
    const priceNum = Number(priceTxt.replace(/\D/g, ""));

    return { value: addon.value, title, priceTxt, priceNum };
  });
}

function getSelectedPlanPrice(billing, planName) {
  if (!planName) return 0;
  const planEl = document.getElementById(`${planName}-price`);
  if (!planEl) return 0;

  const priceStr = planEl.dataset[billing];
  return Number(priceStr.replace(/\D/g, ""));
}

function validatePlanStep() {
  const selectedPlan = document.querySelector('input[name="plan"]:checked');
  const planError = document.getElementById("plan-error");

  if (!selectedPlan) {
    planError.textContent = "Please select a plan";
    planError.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  planError.textContent = "";
  formState.plan = selectedPlan.value;
  return true;
}

function validatePersonalInfo() {
  return (
    validateName(nameInput) &&
    validateEmail(emailInput) &&
    validatePhone(phoneInput)
  );
}

function validateName(nameInput) {
  const nameError = document.getElementById("name-error");
  const name = nameInput.value.trim().replace(/\s+/g, " ");
  nameInput.value = name;

  if (name === "") {
    nameError.textContent = "This field is required";
    nameInput.setAttribute("aria-invalid", "true");
    return false;
  }
  if (!/^[A-Za-z\s]+$/.test(name)) {
    nameError.textContent = "Name must contain letters only.";
    nameInput.setAttribute("aria-invalid", "true");
    return false;
  }
  if (name.length < 4) {
    nameError.textContent = "Name must be at least 4 characters.";
    nameInput.setAttribute("aria-invalid", "true");
    return false;
  }

  nameError.textContent = "";
  nameInput.setAttribute("aria-invalid", "false");
  formState.personalInfo.name = name;
  return true;
}

function validateEmail(emailInput) {
  const emailError = document.getElementById("email-error");
  const email = emailInput.value.trim();

  if (email === "") {
    emailError.textContent = "This field is required";
    emailInput.setAttribute("aria-invalid", "true");
    return false;
  }
  if (/\s/.test(email)) {
    emailError.textContent = "Email must not contain spaces.";
    emailInput.setAttribute("aria-invalid", "true");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    emailError.textContent = "Enter a valid email.";
    emailInput.setAttribute("aria-invalid", "true");
    return false;
  }

  emailError.textContent = "";
  emailInput.setAttribute("aria-invalid", "false");
  formState.personalInfo.email = email;
  return true;
}

function validatePhone(phoneInput) {
  const phoneError = document.getElementById("phone-error");
  const phone = phoneInput.value.trim();

  if (phone === "") {
    phoneError.textContent = "This field is required";
    phoneInput.setAttribute("aria-invalid", "true");
    return false;
  }
  if (/\s/.test(phone)) {
    phoneError.textContent = "No spaces allowed";
    phoneInput.setAttribute("aria-invalid", "true");
    return false;
  }
  if (!/^\+?[0-9]{8,15}$/.test(phone)) {
    phoneError.textContent = "Enter valid phone.";
    phoneInput.setAttribute("aria-invalid", "true");
    return false;
  }

  phoneError.textContent = "";
  phoneInput.setAttribute("aria-invalid", "false");
  formState.personalInfo.phone = phone;
  return true;
}

function updatePlanUI(billing) {
  const planPrices = document.querySelectorAll(".plan-price");
  const planBonuses = document.querySelectorAll(".plan-bonus");

  if (billing === "monthly") {
    planPrices.forEach((plan) => (plan.textContent = plan.dataset.monthly));
    planBonuses.forEach((el) => (el.hidden = true));
  } else {
    planPrices.forEach((plan) => (plan.textContent = plan.dataset.yearly));
    planBonuses.forEach((el) => (el.hidden = false));
  }
}

function updateAddonsUI(billing) {
  const addonPrices = document.querySelectorAll(".addon-price");

  if (billing === "monthly") {
    addonPrices.forEach((addon) => (addon.textContent = addon.dataset.monthly));
  } else {
    addonPrices.forEach((addon) => (addon.textContent = addon.dataset.yearly));
  }
}

function renderSummary(plan, billing, addons) {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const planNameEl = document.querySelector(".summary-plan .plan-name");
  const planPeriodEl = document.querySelector(".plan-name .plan-period");

  if (planNameEl && planPeriodEl) {
    const planText = plan ? capitalize(plan) : "No Plan Selected";
    planNameEl.textContent = planText + " ";
    planNameEl.appendChild(planPeriodEl);
  }

  if (planPeriodEl) {
    const periodText = billing.charAt(0).toUpperCase() + billing.slice(1);
    planPeriodEl.textContent = `(${periodText})`;
  }

  const planPriceEl = document.querySelector(".cur-plan-price");
  const planPriceVal = getSelectedPlanPrice(billing, plan);

  if (planPriceEl) {
    planPriceEl.textContent = `$${planPriceVal}/${billing === "monthly" ? "mo" : "yr"}`;
  }

  const summaryContainer = document.querySelector(".addons-summary");
  let addonsTotal = 0;

  if (summaryContainer) {
    summaryContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();

    addons.forEach((addon) => {
      addonsTotal += addon.priceNum;

      const addonItem = document.createElement("div");
      addonItem.classList.add("addon-item");

      const dt = document.createElement("dt");
      dt.textContent = addon.title;

      const dd = document.createElement("dd");
      dd.classList.add("addon-price");
      dd.textContent = addon.priceTxt;

      addonItem.appendChild(dt);
      addonItem.appendChild(dd);
      fragment.appendChild(addonItem);
    });

    summaryContainer.appendChild(fragment);
  }

  const total = planPriceVal + addonsTotal;
  formState.totalPrice = total;

  const totalLabelEl = document.querySelector(".total-label");
  const totalPriceEl = document.querySelector(".total .total-price");

  if (totalLabelEl) {
    totalLabelEl.textContent = `Total (per ${billing === "monthly" ? "month" : "year"})`;
  }

  if (totalPriceEl) {
    totalPriceEl.textContent = `+$${total}/${billing === "monthly" ? "mo" : "yr"}`;
  }
}

function render(state) {
  updatePlanUI(state.billing);
  updateAddonsUI(state.billing);

  if (state.currentStep === 4) {
    renderSummary(state.plan, state.billing, state.addons);
  }

  saveState();
}

function saveState() {
  localStorage.setItem("formState", JSON.stringify(formState));
}

function loadState() {
  const saved = localStorage.getItem("formState");
  if (saved) {
    Object.assign(formState, JSON.parse(saved));

    if (formState.personalInfo.name)
      nameInput.value = formState.personalInfo.name;
    if (formState.personalInfo.email)
      emailInput.value = formState.personalInfo.email;
    if (formState.personalInfo.phone)
      phoneInput.value = formState.personalInfo.phone;

    if (formState.plan) {
      const planInput = document.querySelector(
        `input[name="plan"][value="${formState.plan}"]`,
      );
      if (planInput) planInput.checked = true;
    }

    const billingInput = document.querySelector(
      `input[name="billing"][value="${formState.billing}"]`,
    );
    if (billingInput) billingInput.checked = true;

    if (formState.addons && formState.addons.length > 0) {
      formState.addons.forEach((addon) => {
        const addonInput = document.querySelector(
          `input[name="addons"][value="${addon.value}"]`,
        );
        if (addonInput) addonInput.checked = true;
      });
    }

    if (formState.currentStep > 1) {
      updateStepVisibility(0, formState.currentStep - 1);
    }

    render(formState);
  }
}

window.addEventListener("DOMContentLoaded", loadState);
