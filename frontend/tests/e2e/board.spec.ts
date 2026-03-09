import { expect, test } from "@playwright/test";

test("executa o fluxo principal do kanban", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Implementação de Propostas" })).toBeVisible();
  await expect(page.getByTestId("column-captacao")).toBeVisible();

  const titleInput = page.getByTestId("column-title-captacao");
  await titleInput.fill("Originação");
  await titleInput.blur();
  await expect(titleInput).toHaveValue("Originação");

  await page.getByTestId("add-card-title-triagem").fill("Vida PME Grupo Delta");
  await page
    .getByTestId("add-card-details-triagem")
    .fill("Validar número de vidas elegíveis e regra comercial para início em maio.");
  await page.getByTestId("add-card-submit-triagem").click();

  const newCard = page.getByText("Vida PME Grupo Delta");
  await expect(newCard).toBeVisible();

  await page.getByRole("button", { name: "Excluir card Vida PME Grupo Delta" }).click();
  await expect(newCard).toHaveCount(0);

  const sourceCard = page.getByTestId("drag-handle-card-captacao-2");
  const targetCard = page.getByTestId("drag-handle-card-triagem-1");
  const sourceBox = await sourceCard.boundingBox();
  const targetBox = await targetCard.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Não foi possível localizar os elementos para drag and drop.");
  }

  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
    steps: 12,
  });
  await page.mouse.up();

  await expect(page.getByTestId("column-triagem")).toContainText("Prestamista Cooperativa Prisma");
});
