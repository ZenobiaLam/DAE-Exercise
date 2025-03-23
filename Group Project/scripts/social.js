// View Navigation System
document.addEventListener("click", function (e) {
    // Handle navigation link clicks
    const navLink = e.target.closest("[data-view]");
    if (navLink) {
      const viewId = navLink.getAttribute("data-view");
      showView(viewId);
  
      // Update active states
      document
        .querySelectorAll(".nav-link, .app-nav-link, .menu-link")
        .forEach((link) => {
          if (link.getAttribute("data-view") === viewId) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
    }
  });

  showView('feed')
  
  async function showView(viewId) {
  
    
    // Hide all views
    document.querySelectorAll(".content-view").forEach((view) => {
      view.classList.remove("active");
    });
  
    // Show the selected view
    const selectedView = document.getElementById(viewId);
    if (selectedView) {
      let res = await fetch(`../components/${viewId}.html`);
      let text = await res.text();
      if (!text.includes("Cannot GET")) {
        selectedView.innerHTML = text;
        selectedView.querySelectorAll("script").forEach((script) => {
          let text = script.innerHTML;
          eval(text);
        });
      }
  
      selectedView.classList.add("active");
    }
  }
  
  // Reaction System - Using event delegation for all posts
  document.addEventListener("click", function (e) {
    // Check if the clicked element is a reaction button or one of its children
    const reactionBtn = e.target.closest(".reaction-btn");
    if (reactionBtn) {
      // Toggle active state
      reactionBtn.classList.toggle("active");
  
      // Update count
      let count = parseInt(
        reactionBtn.querySelector(".reaction-count").textContent
      );
      reactionBtn.querySelector(".reaction-count").textContent =
        reactionBtn.classList.contains("active") ? count + 1 : count - 1;
  
      // Create floating effect
      const effect = document.createElement("span");
      effect.className = "reaction-effect";
      effect.innerHTML = reactionBtn.querySelector("i").outerHTML;
      reactionBtn.appendChild(effect);
  
      // Remove effect after animation
      setTimeout(() => effect.remove(), 1000);
    }
  });
  
  // Comment System - Using event delegation
  document.addEventListener("keypress", function (e) {
    if (e.target.classList.contains("comment-input")) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (e.target.value.trim()) {
          addComment(e.target);
          e.target.value = "";
        }
      }
    }
  });
  
  function addComment(inputElement) {
    const content = inputElement.value;
    const commentsContainer = inputElement
      .closest(".comments-section")
      .querySelector(".comments-container");
  
    const comment = document.createElement("div");
    comment.className = "comment";
    comment.innerHTML = `
      <div class="comment-header">
        <img src="https://picsum.photos/200/200?random=1" alt="User" class="comment-avatar">
        <span class="comment-user">You</span>
        <span class="comment-time">Just now</span>
      </div>
      <div class="comment-content">${content}</div>
      <div class="comment-actions">
        <span class="comment-action">Like</span>
        <span class="comment-action">Reply</span>
        <span class="comment-action">Share</span>
      </div>
    `;
  
    commentsContainer.insertBefore(comment, commentsContainer.firstChild);
  }
  
  // Share Modal - Using event delegation
  document.addEventListener("click", function (e) {
    // Check if the clicked element is a share button or one of its children
    const shareBtn = e.target.closest(".post-button-action");
    if (shareBtn && shareBtn.textContent.trim() === "Share") {
      toggleShareModal();
    }
  
    // Handle modal close button
    if (e.target.closest(".close-modal")) {
      toggleShareModal();
    }
  
    // Handle modal overlay click
    if (e.target.classList.contains("modal-overlay")) {
      toggleShareModal();
    }
  
    // Handle share options
    const shareOption = e.target.closest(".share-option");
    if (shareOption) {
      alert("Sharing to " + shareOption.querySelector("span").textContent);
    }
  
    // Handle copy button
    if (e.target.classList.contains("copy-btn")) {
      const input = document.querySelector(".share-link input");
      input.select();
      document.execCommand("copy");
      e.target.textContent = "Copied!";
      setTimeout(() => (e.target.textContent = "Copy"), 2000);
    }
  });
  
  function toggleShareModal() {
    document.querySelector(".share-modal").classList.toggle("active");
    document.querySelector(".modal-overlay").classList.toggle("active");
  }
  
  // Follow buttons
  document.addEventListener("click", function (e) {
    const followBtn = e.target.closest(".follow-btn");
    if (followBtn) {
      if (followBtn.textContent === "Follow") {
        followBtn.textContent = "Following";
        followBtn.style.background = "var(--primary-neon)";
        followBtn.style.color = "var(--bg-dark)";
      } else {
        followBtn.textContent = "Follow";
        followBtn.style.background = "transparent";
        followBtn.style.color = "var(--primary-neon)";
      }
    }
  });
  
  // Bookmark tabs
  document.addEventListener("click", function (e) {
    const bookmarkTab = e.target.closest(".bookmark-tab");
    if (bookmarkTab) {
      document.querySelectorAll(".bookmark-tab").forEach((tab) => {
        tab.classList.remove("active");
      });
      bookmarkTab.classList.add("active");
    }
  });
  
  // Profile tabs
  document.addEventListener("click", function (e) {
    const profileTab = e.target.closest(".profile-tab");
    if (profileTab) {
      document.querySelectorAll(".profile-tab").forEach((tab) => {
        tab.classList.remove("active");
      });
      profileTab.classList.add("active");
    }
  });
  
  // Settings toggles
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("toggle-input")) {
      // Handle toggle changes if needed
      console.log("Toggle changed:", e.target.checked);
    }
  });
  
  // Topic actions
  document.addEventListener("click", function (e) {
    const topicAction = e.target.closest(".topic-action");
    if (topicAction) {
      if (topicAction.textContent === "Follow") {
        topicAction.textContent = "Following";
        topicAction.style.background = "var(--primary-neon)";
        topicAction.style.color = "var(--bg-dark)";
      } else {
        topicAction.textContent = "Follow";
        topicAction.style.background = "rgba(15, 255, 255, 0.1)";
        topicAction.style.color = "var(--primary-neon)";
      }
    }
  }); 