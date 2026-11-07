
document.addEventListener("DOMContentLoaded", () => {
  // MAIN WEBSITE: pull the lamp down to enter
  const entrance = document.getElementById("entrance");
  const weddingSite = document.getElementById("weddingSite");
  const lamp = document.getElementById("lamp");
  const music = document.getElementById("weddingMusic");
  const musicButton = document.getElementById("musicButton");

  if (lamp && entrance && weddingSite) {
    let startY = 0;
    let dragging = false;
    let opened = false;

    lamp.addEventListener("pointerdown", (event) => {
      if (opened) return;
      dragging = true;
      startY = event.clientY;
      lamp.setPointerCapture(event.pointerId);
    });

    lamp.addEventListener("pointermove", (event) => {
      if (!dragging || opened) return;

      const distance = Math.max(0, Math.min(120, event.clientY - startY));
      lamp.style.transform = `translateY(${distance}px)`;

      if (distance >= 90) {
        opened = true;
        entrance.classList.add("hidden");
        weddingSite.classList.remove("hidden");
        window.scrollTo(0, 0);

        if (music) {
          music.play().catch(() => {
            // The music button remains available if autoplay is blocked.
          });
        }
      }
    });

    const stopDragging = () => {
      if (!opened) {
        lamp.style.transform = "translateY(0)";
      }
      dragging = false;
    };

    lamp.addEventListener("pointerup", stopDragging);
    lamp.addEventListener("pointercancel", stopDragging);
  }

  // MUSIC BUTTON
  if (musicButton && music) {
    musicButton.addEventListener("click", async () => {
      try {
        if (music.paused) {
          await music.play();
          musicButton.textContent = "♫ Pause Wedding Music";
        } else {
          music.pause();
          musicButton.textContent = "♫ Play Wedding Music";
        }
      } catch (error) {
        musicButton.textContent = "Music could not be played";
      }
    });

    music.addEventListener("play", () => {
      musicButton.textContent = "♫ Pause Wedding Music";
    });

    music.addEventListener("pause", () => {
      musicButton.textContent = "♫ Play Wedding Music";
    });
  }

  // WEDDING COUNTDOWN
  const countdown = document.getElementById("countdownTimer");

  if (countdown) {
    const weddingDate = new Date("2026-11-15T08:00:00+05:30");

    function updateCountdown() {
      let remaining = weddingDate.getTime() - Date.now();

      if (remaining <= 0) {
        countdown.innerHTML = "<h3>Today is the wedding day! ♥</h3>";
        return;
      }

      const days = Math.floor(remaining / 86400000);
      remaining %= 86400000;

      const hours = Math.floor(remaining / 3600000);
      remaining %= 3600000;

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      document.getElementById("days").textContent = days;
      document.getElementById("hours").textContent = hours;
      document.getElementById("minutes").textContent = minutes;
      document.getElementById("seconds").textContent = seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // QR CODE: creates a QR code for this invitation page after publishing
  const qrContainer = document.getElementById("invitationQR");
  const qrMessage = document.getElementById("qrMessage");
  const downloadQR = document.getElementById("downloadQR");

  if (qrContainer) {
    const isPublished =
      window.location.protocol === "https:" ||
      window.location.protocol === "http:";

    if (isPublished && window.QRCode) {
      new QRCode(qrContainer, {
        text: window.location.href,
        width: 190,
        height: 190,
        colorDark: "#35121e",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      if (qrMessage) {
        qrMessage.textContent = "Scan this code to open this invitation page.";
      }

      if (downloadQR) {
        downloadQR.addEventListener("click", () => {
          const qrImage = qrContainer.querySelector("img");
          const qrCanvas = qrContainer.querySelector("canvas");
          const imageURL = qrImage ? qrImage.src :
            (qrCanvas ? qrCanvas.toDataURL("image/png") : null);

          if (!imageURL) {
            alert("QR code is not ready yet. Please try again.");
            return;
          }

          const link = document.createElement("a");
          link.href = imageURL;
          link.download = "Muthu-Kumar-Vigneshwari-Wedding-QR.png";
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
      }
    } else if (qrMessage) {
      qrMessage.textContent =
        "Publish this website on GitHub Pages to create your shareable QR code.";
      if (downloadQR) downloadQR.disabled = true;
    }
  }
});
