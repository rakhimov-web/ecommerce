import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import uz from "@/messages/uz.json";
import ru from "@/messages/ru.json";
import { MotionProvider } from "@/components/ui/MotionProvider";
export function renderUI(children: ReactNode, locale: "uz" | "ru" = "uz") {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "uz" ? uz : ru}
    >
      <MotionProvider>{children}</MotionProvider>
    </NextIntlClientProvider>,
  );
}
