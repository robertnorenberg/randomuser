import { test, expect } from '@playwright/test';

test.describe("password", () => {
  const getPasswords = async (request, params="") => {
    const resp = await request.get("https://randomuser.me/api/" + params);
    const json = await resp.json();
    return json.results.map((person) => person.login.password);
  };

  test("is granted to every user", async ({ request }) => {
    const passwords = await getPasswords(request, "?results=10&password=upper,8-8");
    expect(passwords.length).toBe(10);
    expect(passwords.every(pass => pass.length == 8)).toBe(true);
  });

  test("is granted by default", async ({ request }) => {
    const passwords = await getPasswords(request, "");
    expect(passwords[0].length).toBeGreaterThan(0);
  });

  test("has length of 8 to 64 when charset specified", async ({ request }) => {
    const passwords = await getPasswords(request, "?password=lower");
    expect(passwords[0].length).toBeGreaterThanOrEqual(8);
    expect(passwords[0].length).toBeLessThanOrEqual(64);
  });

  test("uses requested length", async ({ request }) => {
    expect((await getPasswords(request, "?password=lower,1-1"))[0].length).toEqual(1);
    expect((await getPasswords(request, "?password=lower,5-5"))[0].length).toEqual(5);
    expect((await getPasswords(request, "?password=lower,10-10"))[0].length).toEqual(10);
    expect((await getPasswords(request, "?password=lower,20-20"))[0].length).toEqual(20);
    expect((await getPasswords(request, "?password=lower,30-30"))[0].length).toEqual(30);
  });

  test("ignores invalid length request", async ({ request }) => {
    expect((await getPasswords(request, "?password=lower,99-99"))[0].length).toBeLessThanOrEqual(64);
  });

  test("uses special characters", async ({ request }) => {
    const passwords = await getPasswords(request, "?password=special,20-20");
    expect(passwords[0]).toMatch(/[!"#$%&'()*+,\- .\/:;<=>?@\[\\\]^_`{|}~]{20}/);
  });

  test("uses uppercase characters", async ({ request }) => {
    const passwords = await getPasswords(request, "?password=upper,20-20");
    expect(passwords[0]).toMatch(/^[A-Z]{20}$/);
  });

  test("uses lowercase characters", async ({ request }) => {
    const passwords = await getPasswords(request, "?password=lower,20-20");
    expect(passwords[0]).toMatch(/^[a-z]{20}$/);
  });

  test("uses numbers", async ({ request }) => {
    const passwords = await getPasswords(request, "?password=number,20-20");
    expect(passwords[0]).toMatch(/^[0-9]{20}$/);
  });

  test("uses mixed charset", async ({ request }) => {
    const passwords = await getPasswords(request, "?password=number,upper,lower,64-64");
    expect(passwords[0]).toMatch(/^[0-9a-zA-Z]{64}$/);
  });
});
