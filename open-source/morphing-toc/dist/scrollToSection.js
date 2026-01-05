'use strict';

function scrollToSection(id, offset = 80) {
  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}

exports.scrollToSection = scrollToSection;
//# sourceMappingURL=scrollToSection.js.map
//# sourceMappingURL=scrollToSection.js.map