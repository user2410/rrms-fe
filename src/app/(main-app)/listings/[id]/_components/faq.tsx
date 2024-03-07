import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

export default function Faq() {
  const questions = [
    {
      question: "Tôi có thể xem nhà này khi nào?",
      answer: "Bạn có thể xem nhà bất kỳ lúc nào, chỉ cần liên hệ với chúng tôi qua số điện thoại 0123456789"
    },
    {
      question: "Tôi có thể xem nhà này khi nào?",
      answer: "Bạn có thể xem nhà bất kỳ lúc nào, chỉ cần liên hệ với chúng tôi qua số điện thoại 0123456789"
    },
    {
      question: "Tôi có thể xem nhà này khi nào?",
      answer: "Bạn có thể xem nhà bất kỳ lúc nào, chỉ cần liên hệ với chúng tôi qua số điện thoại 0123456789"
    },
    {
      question: "Tôi có thể xem nhà này khi nào?",
      answer: "Bạn có thể xem nhà bất kỳ lúc nào, chỉ cần liên hệ với chúng tôi qua số điện thoại 0123456789"
    },
  ];

  const [expand, setExpand] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Câu hỏi thường gặp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(expand ? questions : questions.slice(0,3)).map((faq, index) => (
          <div key={index} className="space-y-1">
            <div className="font-bold">{faq.question}</div>
            <div>{faq.answer}</div>
          </div>
        ))}
        {questions.length > 3 && (
          <Button variant="link" onClick={() => setExpand(!expand)}>
            {expand ? (
              <span className="flex flex-row items-center gap-1">
                Thu gọn
                <ChevronUpIcon className="w-4 h-4" />
              </span>
            ) : (
              <span className="flex flex-row items-center gap-1">
                Xem thêm
                <ChevronDownIcon className="w-4 h-4" />
              </span>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
