document.addEventListener("DOMContentLoaded", () => {
  // --- 1. PROFILE MANAGEMENT ---
  const editNameInput = document.getElementById("editName");
  const editMajorInput = document.getElementById("editMajor");
  const editYearInput = document.getElementById("editYear");

  function syncModalInputs() {
    editNameInput.value = document.getElementById("displayFullName").innerText;
    editMajorInput.value = document.getElementById("displayMajor").innerText;
    editYearInput.value = document.getElementById("displayYear").innerText;
  }
  syncModalInputs();

  document.getElementById("editProfileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newName = editNameInput.value;
    document.getElementById("displayFullName").innerText = newName;
    document.getElementById("welcomeName").innerText = newName.split(" ")[0];
    document.getElementById("displayMajor").innerText = editMajorInput.value;
    document.getElementById("displayYear").innerText = editYearInput.value;

    const profileImageInput = document.getElementById("profileImageInput");
    if (profileImageInput.files && profileImageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        document.getElementById("profileImagePreview").src = evt.target.result;
        document
          .getElementById("profileImagePreview")
          .classList.remove("d-none");
        document.getElementById("defaultAvatarIcon").classList.add("d-none");
      };
      reader.readAsDataURL(profileImageInput.files[0]);
    }
    bootstrap.Modal.getInstance(
      document.getElementById("editProfileModal"),
    ).hide();
  });

  document.getElementById("deleteProfileBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete your profile card?")) {
      document.getElementById("profileCardSection").innerHTML = `
            <div class="card-body text-center py-5">
              <i class="bi bi-person-x text-danger display-4 mb-3"></i>
              <h6 class="text-muted fw-bold">Profile Deleted</h6>
              <button class="btn btn-outline-danger btn-sm mt-2" onclick="location.reload()">Restore Profile</button>
            </div>`;
    }
  });

  // --- 2. REGISTRATION MANAGER (CRUD AFTER SUBMISSION) ---
  let registrations = [];
  const courseForm = document.getElementById("courseRegistrationForm");
  const tableBody = document.getElementById("registrationsTableBody");
  const regCountBadge = document.getElementById("regCountBadge");

  function renderRegistrations() {
    if (registrations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No course registrations submitted yet. Fill out the form below to register.</td></tr>`;
      regCountBadge.innerText = "0 Active";
      return;
    }

    tableBody.innerHTML = "";
    regCountBadge.innerText = `${registrations.length} Active`;

    registrations.forEach((reg, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td class="ps-3 fw-semibold">${reg.fullName}</td>
            <td>${reg.major}</td>
            <td><span class="badge bg-light text-dark border">${reg.term}</span></td>
            <td><span class="badge bg-danger-subtle text-danger border border-danger-subtle">${reg.track}</span></td>
            <td class="text-end pe-3">
              <button class="btn btn-sm btn-outline-primary me-1 py-1 px-2" onclick="openEditReg(${index})"><i class="bi bi-pencil"></i> Edit</button>
              <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="deleteReg(${index})"><i class="bi bi-trash"></i> Delete</button>
            </td>
          `;
      tableBody.appendChild(row);
    });
  }

  courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!courseForm.checkValidity()) {
      courseForm.classList.add("was-validated");
      return;
    }

    const newReg = {
      fullName: document.getElementById("regFullName").value,
      email: document.getElementById("regEmail").value,
      major: document.getElementById("regMajor").value,
      term: document.getElementById("regTerm").value,
      track: document.getElementById("regTrack").value,
    };

    registrations.push(newReg);
    renderRegistrations();
    courseForm.reset();
    courseForm.classList.remove("was-validated");
    alert(
      "Registration submitted successfully! You can modify or delete it anytime from the 'My Active Registrations' section above.",
    );
  });

  window.deleteReg = function (index) {
    if (confirm("Are you sure you want to delete this registration?")) {
      registrations.splice(index, 1);
      renderRegistrations();
    }
  };

  window.openEditReg = function (index) {
    const reg = registrations[index];
    document.getElementById("editRegIndex").value = index;
    document.getElementById("modalRegName").value = reg.fullName;
    document.getElementById("modalRegMajor").value = reg.major;
    document.getElementById("modalRegTerm").value = reg.term;
    document.getElementById("modalRegTrack").value = reg.track;

    const editModal = new bootstrap.Modal(
      document.getElementById("editRegModal"),
    );
    editModal.show();
  };

  document.getElementById("editRegForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const index = document.getElementById("editRegIndex").value;
    registrations[index] = {
      fullName: document.getElementById("modalRegName").value,
      major: document.getElementById("modalRegMajor").value,
      term: document.getElementById("modalRegTerm").value,
      track: document.getElementById("modalRegTrack").value,
    };

    renderRegistrations();
    bootstrap.Modal.getInstance(document.getElementById("editRegModal")).hide();
    alert("Registration updated successfully!");
  });
});
