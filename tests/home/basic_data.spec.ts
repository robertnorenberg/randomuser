import { test, expect } from '@playwright/test';

test.describe('when data icon hovered', () => {
  const waitForIconHover = async (page, label, user_title) => {
    const user_value = await page.locator(`css=#user_value`);
    const title = await page.locator(`css=#user_title`);
    const hoverable = await page.locator(`css=#values_list > [data-label="${label}"]`);
    await hoverable.hover();

    await expect(title).toHaveText(user_title)
    return await user_value.innerText().valueOf();
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('https://randomuser.me');
    const user_value = await page.locator(`css=#user_value`);
    const title = await page.locator(`css=#user_title`);
    await expect(title).not.toHaveText("");
    await expect(user_value).not.toHaveText("...");
  });

  test("reveals capitalized name", async ({ page }) => {
    const name = await waitForIconHover(page, "name", "Hi, My name is");
    await expect(name).toEqual(expect.stringMatching(/^[A-Z].+/));
  });

  test("reveals an email", async ({ page }) => {
    const email = await waitForIconHover(page, "email", "My email address is");
    await expect(email).toMatch(/[^@]+@example.com/);
  });

  test("reveals a valid birthday date in M/D/Y format", async ({ page }) => {
    const birthday = await waitForIconHover(page, "birthday", "My birthday is");
    await expect(birthday).toMatch(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/);
    await expect(new Date(birthday).valueOf()).not.toEqual(NaN);
  });

  test("reveals address starting with a number", async ({ page }) => {
    const location = await waitForIconHover(page, "location", "My address is");
    await expect(location).toMatch(/^[0-9].+/);
  });

  test("reveals phone number", async ({ page }) => {
    const location = await waitForIconHover(page, "phone", "My phone number is");
    await expect(location).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
  });

  test("reveals password", async ({ page }) => {
    const password = await waitForIconHover(page, "pass", "My password is");
    await expect(password.length).toBeGreaterThanOrEqual(3);
  });
});
