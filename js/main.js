AOS.init({ once: true, duration: 800 });

      // Interactive Particle Canvas
      const canvas = document.getElementById('particleCanvas');
      const ctx = canvas.getContext('2d');
      let particles = [];
      const particleCount = 45;

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = (Math.random() - 0.5) * 0.4;
          this.radius = Math.random() * 1.5 + 1;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#06b6d4';
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 - distance / 1000})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(animate);
      }
      animate();

      // Modal Gallery logic
      let currentImages = [];
      let currentImageIndex = 0;

      function openModal(title, imagesArray) {
        const modal = document.getElementById('imageModal');
        const modalTitle = document.getElementById('modalTitle');
        currentImages = Array.isArray(imagesArray) ? imagesArray : [imagesArray];
        currentImageIndex = 0;
        modalTitle.textContent = title;
        updateGallery();
        modal.classList.remove('hidden');
        setTimeout(() => modal.style.opacity = '1', 10);
        document.body.style.overflow = 'hidden';
      }

      function updateGallery() {
        const modalImage = document.getElementById('modalImage');
        const modalCounter = document.getElementById('modalCounter');
        const modalThumbnails = document.getElementById('modalThumbnails');
        const prevBtn = document.getElementById('modalPrevBtn');
        const nextBtn = document.getElementById('modalNextBtn');
        const scrollContainer = document.getElementById('imageScrollContainer');
        
        modalImage.src = currentImages[currentImageIndex];
        modalCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
        
        if (scrollContainer) scrollContainer.scrollTop = 0;

        if (currentImages.length <= 1) {
          prevBtn.classList.add('hidden');
          nextBtn.classList.add('hidden');
          modalThumbnails.style.display = 'none';
        } else {
          prevBtn.classList.remove('hidden');
          nextBtn.classList.remove('hidden');
          modalThumbnails.style.display = 'flex';
          modalThumbnails.innerHTML = currentImages.map((imgSrc, idx) => `
            <button onclick="selectImage(${idx})" aria-label="View screenshot ${idx + 1}" class="thumb-btn ${idx === currentImageIndex ? 'active' : ''}">
              <img src="${imgSrc}" alt="Thumbnail ${idx + 1}">
            </button>
          `).join('');
        }
      }

      function selectImage(index) {
        currentImageIndex = index;
        updateGallery();
      }

      function nextImage() {
        if (currentImages.length <= 1) return;
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateGallery();
      }

      function prevImage() {
        if (currentImages.length <= 1) return;
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateGallery();
      }

      function closeModal() {
        const modal = document.getElementById('imageModal');
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.classList.add('hidden');
          document.body.style.overflow = 'auto';
        }, 300);
      }

      function closeModalOnBackdrop(event) {
        if (event.target.id === 'imageModal') closeModal();
      }

      function openFullscreen() {
        const modalImage = document.getElementById('modalImage');
        const fullscreenViewer = document.getElementById('fullscreenViewer');
        const fullscreenImage = document.getElementById('fullscreenImage');
        fullscreenImage.src = modalImage.src;
        fullscreenViewer.classList.remove('hidden');
        setTimeout(() => fullscreenViewer.style.opacity = '1', 10);
      }

      function closeFullscreen() {
        const fullscreenViewer = document.getElementById('fullscreenViewer');
        fullscreenViewer.style.opacity = '0';
        setTimeout(() => fullscreenViewer.classList.add('hidden'), 300);
      }

      document.addEventListener('keydown', (e) => {
        const fullscreenViewer = document.getElementById('fullscreenViewer');
        if (!fullscreenViewer.classList.contains('hidden')) {
          if (e.key === 'Escape') closeFullscreen();
          return;
        }
        const modal = document.getElementById('imageModal');
        if (!modal.classList.contains('hidden')) {
          if (e.key === 'ArrowRight') nextImage();
          if (e.key === 'ArrowLeft') prevImage();
          if (e.key === 'Escape') closeModal();
        }
      });