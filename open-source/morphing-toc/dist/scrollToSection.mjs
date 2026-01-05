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

export { scrollToSection };
//# sourceMappingURL=scrollToSection.mjs.map
//# sourceMappingURL=scrollToSection.mjs.map