import React from "react";
import OrDividerLine from "./OrDividerLine";
import SigninWithGoogleBtn from "./SigninWithGoogleBtn";
import SigninWithFacebookBtn from "./SigninWithFacebookBtn";
import FormFooterText from "./FormFooterText";

interface Props {
  divider?: boolean;
  signWithGoogle?: boolean | string;
  signWithFacebook?: boolean | string;

  text?: string;
  linkText?: string;
  link?: string;
}
export default function FormFooter({
  divider,
  signWithGoogle,
  signWithFacebook,

  text,
  linkText,
  link,
}: Props) {
  return (
    <div className="space-y-9">
      {divider ? <OrDividerLine /> : null}
      <div className="space-y-3">
        {signWithGoogle ? <SigninWithGoogleBtn text={signWithGoogle} /> : null}
        {signWithFacebook ? (
          <SigninWithFacebookBtn text={signWithFacebook} />
        ) : null}
      </div>
      {text ? (
        <FormFooterText text={text} linkText={linkText} link={link} />
      ) : null}
    </div>
  );
}
