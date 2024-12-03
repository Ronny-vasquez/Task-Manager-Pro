const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

// URL de la página de login
const URL = "http://localhost:3000/login";

// Credenciales para pruebas
const VALID_EMAIL = "alexanderbonifacio8@gmail.com";
const VALID_PASSWORD = "123456";

//cuenta random
const INVALID_EMAIL = "2021@itla.edu.do";
const INVALID_PASSWORD = "654321";

// Carpeta para capturas y reporte
const ASSETS_DIR = path.resolve(__dirname, "assets");
const REPORT_FILE = path.resolve(ASSETS_DIR, "test_report.html");

// Crea la carpeta si no existe
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Variables para el reporte
let reportContent = `<html>
<head>
  <title>Reporte de Pruebas</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; }
    .fail { color: red; }
    img { max-width: 300px; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>Reporte de Pruebas</h1>
  <ul>
`;

// Función para guardar capturas de pantalla
async function takeScreenshot(driver, fileName) {
  const screenshot = await driver.takeScreenshot();
  const filePath = path.join(ASSETS_DIR, fileName);
  fs.writeFileSync(filePath, screenshot, "base64");
  return fileName;
}

// Prueba de Login Fallido
async function testLoginFail() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    console.log("==== Prueba de Login Fallido ====");
    await driver.get(URL);

    await performLogin(driver, INVALID_EMAIL, INVALID_PASSWORD);

    const errorMessage = await driver.wait(
      until.elementLocated(By.css(".alert")),
      3000
    );

    const errorText = await errorMessage.getText();
    const screenshot = await takeScreenshot(driver, "login_fail.png");

    if (
      errorText.includes("El correo ingresado no está registrado") ||
      errorText.includes("La contraseña es incorrecta")
    ) {
      console.log(
        "Prueba Exitosa: El sistema mostró un mensaje de error adecuado."
      );
      reportContent += `
        <li>
          <h2>Prueba de Login Fallido: <span class="success">Éxito</span></h2>
          <p>El sistema mostró un mensaje de error adecuado.</p>
          <img src="${screenshot}" alt="Captura de Login Fallido">
        </li>
      `;
    } else {
      console.error("Prueba Fallida: El mensaje de error no es el esperado.");
      reportContent += `
        <li>
          <h2>Prueba de Login Fallido: <span class="fail">Fallo</span></h2>
          <p>El mensaje de error no es el esperado.</p>
          <img src="${screenshot}" alt="Captura de Login Fallido">
        </li>
      `;
    }
  } catch (error) {
    console.error("Error en la prueba de Login Fallido:", error);
    const screenshot = await takeScreenshot(driver, "login_fail_error.png");
    reportContent += `
      <li>
        <h2>Prueba de Login Fallido: <span class="fail">Fallo</span></h2>
        <p>Error inesperado: ${error.message}</p>
        <img src="${screenshot}" alt="Captura de Error en Login Fallido">
      </li>
    `;
  } finally {
    await driver.quit();
  }
}

// Prueba de Login Exitoso
async function testLoginSuccess() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    console.log("==== Prueba de Login Exitoso ====");
    await driver.get(URL);

    await performLogin(driver, VALID_EMAIL, VALID_PASSWORD);

    await driver
      .wait(until.urlContains("/crud"), 3000)
      .then(async () => {
        console.log("Prueba Exitosa: Redirigido a /crud");
        const screenshot = await takeScreenshot(driver, "login_success.png");
        reportContent += `
          <li>
            <h2>Prueba de Login Exitoso: <span class="success">Éxito</span></h2>
            <p>Redirigido correctamente a /crud.</p>
            <img src="${screenshot}" alt="Captura de Login Exitoso">
          </li>
        `;
      })
      .catch(async () => {
        console.error("Prueba Fallida: No se redirigió a /crud");
        const screenshot = await takeScreenshot(
          driver,
          "login_success_fail.png"
        );
        reportContent += `
          <li>
            <h2>Prueba de Login Exitoso: <span class="fail">Fallo</span></h2>
            <p>No se redirigió correctamente a /crud.</p>
            <img src="${screenshot}" alt="Captura de Error en Login Exitoso">
          </li>
        `;
      });
  } catch (error) {
    console.error("Error en la prueba de Login Exitoso:", error);
    const screenshot = await takeScreenshot(driver, "login_success_error.png");
    reportContent += `
      <li>
        <h2>Prueba de Login Exitoso: <span class="fail">Fallo</span></h2>
        <p>Error inesperado: ${error.message}</p>
        <img src="${screenshot}" alt="Captura de Error en Login Exitoso">
      </li>
    `;
  } finally {
    await driver.quit();
  }
}

// Función auxiliar para realizar login
async function performLogin(driver, email, password) {
  await driver.wait(until.elementLocated(By.id("email")), 30000);
  const emailField = await driver.findElement(By.id("email"));
  const passwordField = await driver.findElement(By.id("password"));
  const loginButton = await driver.findElement(By.css("button[type='submit']"));

  await emailField.clear();
  await emailField.sendKeys(email);
  await passwordField.clear();
  await passwordField.sendKeys(password);
  await loginButton.click();
}

// Genera el reporte HTML
function generateReport() {
  reportContent += `
  </ul>
  </body>
  </html>
  `;
  fs.writeFileSync(REPORT_FILE, reportContent, "utf-8");
  console.log(`Reporte generado: ${REPORT_FILE}`);
}

// Ejecuta ambas pruebas y genera el reporte
(async function executeTests() {
  await testLoginFail();
  await testLoginSuccess();
  generateReport();
})();
