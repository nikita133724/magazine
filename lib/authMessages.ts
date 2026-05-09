export type Lang = 'RU' | 'KZ';

const dictionary = {
  RU: {
    supabaseMissing: 'Сервис авторизации временно недоступен. Попробуйте позже.',
    invalidLogin: 'Неверный email или пароль.',
    emailNotConfirmed: 'Подтвердите почту кодом из письма, затем войдите снова.',
    weakPassword: 'Пароль должен быть не короче 6 символов.',
    emailTaken: 'Пользователь с такой почтой уже существует. Войдите или восстановите пароль.',
    otpSent: 'Мы отправили код подтверждения на почту. Введите его ниже.',
    otpInvalid: 'Неверный или просроченный код. Проверьте письмо и попробуйте ещё раз.',
    emailRateLimit: 'Слишком много писем отправлено подряд. Подождите 1–2 минуты и попробуйте снова.',
    accountCreated: 'Аккаунт подтверждён. Сейчас откроем личный кабинет.',
    resetSent: 'Письмо для восстановления пароля отправлено на почту.',
    resetSaved: 'Пароль обновлён. Теперь можно войти.',
    generic: 'Что-то пошло не так. Попробуйте ещё раз.',
  },
  KZ: {
    supabaseMissing: 'Авторизация сервисі уақытша қолжетімсіз. Кейінірек қайталап көріңіз.',
    invalidLogin: 'Email немесе құпиясөз қате.',
    emailNotConfirmed: 'Поштадағы код арқылы растаңыз, содан кейін қайта кіріңіз.',
    weakPassword: 'Құпиясөз кемінде 6 таңбадан тұруы керек.',
    emailTaken: 'Бұл пошта тіркелген. Кіріңіз немесе құпиясөзді қалпына келтіріңіз.',
    otpSent: 'Поштаңызға растау кодын жібердік. Кодты төменге енгізіңіз.',
    otpInvalid: 'Код қате немесе мерзімі өтті. Хатты тексеріп, қайта көріңіз.',
    emailRateLimit: 'Қатарынан тым көп хат жіберілді. 1–2 минут күтіп, қайта көріңіз.',
    accountCreated: 'Аккаунт расталды. Қазір жеке кабинет ашылады.',
    resetSent: 'Құпиясөзді қалпына келтіру хаты поштаға жіберілді.',
    resetSaved: 'Құпиясөз жаңартылды. Енді кіре аласыз.',
    generic: 'Бірдеңе дұрыс болмады. Қайталап көріңіз.',
  },
};

export function authText(lang: Lang, key: keyof typeof dictionary.RU) {
  return dictionary[lang][key];
}

export function localizeAuthError(message: string | undefined, lang: Lang = 'RU') {
  const raw = (message || '').toLowerCase();
  if (raw.includes('rate limit') || raw.includes('over_email_send_rate_limit') || raw.includes('email rate limit')) return authText(lang, 'emailRateLimit');
  if (raw.includes('invalid login') || raw.includes('invalid credentials')) return authText(lang, 'invalidLogin');
  if (raw.includes('email not confirmed')) return authText(lang, 'emailNotConfirmed');
  if (raw.includes('password') && (raw.includes('6') || raw.includes('weak'))) return authText(lang, 'weakPassword');
  if (raw.includes('already') || raw.includes('registered') || raw.includes('exists')) return authText(lang, 'emailTaken');
  if (raw.includes('token') || raw.includes('otp') || raw.includes('expired')) return authText(lang, 'otpInvalid');
  if (raw.includes('supabase')) return authText(lang, 'supabaseMissing');
  return message && !/[a-z]{3,}/.test(message) ? message : authText(lang, 'generic');
}
