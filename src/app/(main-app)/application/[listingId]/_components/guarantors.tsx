import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fragment } from "react";

export default function Guarantors() {
  return (
    <Fragment>
      <CardHeader>
        <CardTitle>Guarantors</CardTitle>
        <CardDescription>If you&#39;re applying with a guarantor (sometimes known as a co-signer), enter their info and they&#39;ll be invited via email to join this application. Guarantors are not residents.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="link">Add a Guarantor</Button>
      </CardContent>
    </Fragment>
  );
}
