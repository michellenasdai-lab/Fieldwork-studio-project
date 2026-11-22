<script>
    const services = {
      everyday: { name: "The Everyday", duration: "50 min", price: "$85" },
      "deep-dive": { name: "The Deep Dive", duration: "75 min", price: "$125" },
      "first-visit": { name: "The First Visit", duration: "60 min", price: "$105" }
    };
    const slots = ["9:00 am", "10:30 am", "12:00 pm", "1:30 pm", "3:00 pm", "4:30 pm"];
    const dateList = document.querySelector("#date-list");
    const timeList = document.querySelector("#time-list");
    const serviceSelect = document.querySelector("#service-select");
    const form = document.querySelector("#booking-form");
    const confirmation = document.querySelector("#confirmation");
    const error = document.querySelector("#form-error");
    let selectedDate = null;
    let selectedTime = null;

    function formatDate(date, options) {
      return new Intl.DateTimeFormat("en-US", options).format(date);
    }

    function buildDates() {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      let availableDays = 0;
      for (let offset = 0; availableDays < 5; offset += 1) {
        const date = new Date(today);
        date.setDate(today.getDate() + offset);
        if (date.getDay() === 0 || date.getDay() === 1) continue;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "date-option";
        button.setAttribute("aria-pressed", "false");
        button.dataset.date = date.toISOString();
        button.innerHTML = `<span>${date.toDateString() === today.toDateString() ? "Today" : formatDate(date, { weekday: "short" })}</span><span>${formatDate(date, { month: "short", day: "numeric" })}</span>`;
        button.addEventListener("click", () => {
          selectedDate = date;
          dateList.querySelectorAll("button").forEach(option => option.setAttribute("aria-pressed", String(option === button)));
          error.classList.remove("visible");
        });
        dateList.append(button);
        if (availableDays === 0) button.click();
        availableDays += 1;
      }
    }

    function buildTimes() {
      slots.forEach((slot, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "time-option";
        button.textContent = slot;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          selectedTime = slot;
          timeList.querySelectorAll("button").forEach(option => option.setAttribute("aria-pressed", String(option === button)));
          error.classList.remove("visible");
        });
        timeList.append(button);
        if (index === 0) button.click();
      });
    }

    document.querySelectorAll("[data-service]").forEach(button => {
      button.addEventListener("click", () => {
        serviceSelect.value = button.dataset.service;
        document.querySelector("#book").scrollIntoView({ behavior: "smooth" });
      });
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      error.classList.remove("visible");
      if (!selectedDate || !selectedTime) {
        error.textContent = "Choose a day and time to continue.";
        error.classList.add("visible");
        return;
      }
      if (!form.reportValidity()) return;

      const service = services[serviceSelect.value];
      const name = document.querySelector("#customer-name").value.trim();
      const email = document.querySelector("#customer-email").value.trim();
      document.querySelector("#confirmation-details").innerHTML = `<strong>${service.name}</strong> · ${service.duration} · ${service.price}<br>${formatDate(selectedDate, { weekday: "long", month: "long", day: "numeric" })} at ${selectedTime}<br>${name} · ${email}`;
      confirmation.classList.add("open");
      document.querySelector("#dialog-close").focus();
    });

    function closeConfirmation() {
      confirmation.classList.remove("open");
      document.querySelector("#booking-title").focus({ preventScroll: true });
    }

    document.querySelector("#dialog-close").addEventListener("click", closeConfirmation);
    document.querySelector("#done-button").addEventListener("click", closeConfirmation);
    confirmation.addEventListener("click", event => {
      if (event.target === confirmation) closeConfirmation();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && confirmation.classList.contains("open")) closeConfirmation();
    });
    document.querySelector("#year").textContent = new Date().getFullYear();
    buildDates();
    buildTimes();
  </script>