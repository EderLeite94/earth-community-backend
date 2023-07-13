export function formatEmail(email: string): string {
  const emailParts = email.split('@');
  const username = emailParts[0];
  const domain = emailParts[1];

  const visibleCharacters = 2; // Número de caracteres visíveis no início
  const hiddenCharacters = username.length - visibleCharacters; // Número de caracteres ocultos
  const hiddenPart = '*****';

  const formattedUsername = `${username.slice(0, visibleCharacters)}${hiddenPart}`;
  const formattedEmail = `${formattedUsername}@${domain}`;

  return formattedEmail;
}
