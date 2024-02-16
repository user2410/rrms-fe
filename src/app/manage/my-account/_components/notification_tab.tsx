import Image from "next/image";

export default function NotificationTab() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-light">Thông báo</h1>
      <div className="w-full space-y-4">
        <div className="flex flex-row items-center justify-between w-full">
          <h2>Thông báo mới</h2>
        </div>
        <div className="w-full space-y-4">
          <div className="border">
            <div className="flex flex-row items-center justify-between gap-2 border p-2">
              <div className="flex flex-row items-center gap-2">
                <div className="relative w-[120px] aspect-video">
                  <Image
                    src="/logo.png"
                    fill
                    layout="fill"
                    objectFit="cover"
                    alt="Property image"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-light">Thông báo 1</h3>
                  <p className="text-sm font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla porttitor accumsan tincidunt.</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-light">1 giờ trước</p>
              </div>
            </div>
          </div>
          <div className="border">
            <div className="flex flex-row items-center justify-between gap-2 border p-2">
              <div className="flex flex-row items-center gap-2">
                <div className="relative w-[120px] aspect-video">
                  <Image
                    src="/logo.png"
                    fill
                    layout="fill"
                    objectFit="cover"
                    alt="Property image"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-light">Thông báo 2</h3>
                  <p className="text-sm font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla porttitor accumsan t
                  incidunt.</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-light">2 giờ trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full space-y-4">
        <div className="flex flex-row items-center justify-between w-full">
          <h2>Thông báo cũ</h2>
        </div>
        <div className="w-full space-y-4">
          <div className="border">
            <div className="flex flex-row items-center justify-between gap-2 border p-2">
              <div className="flex flex-row items-center gap-2">
                <div className="relative w-[120px] aspect-video">
                  <Image
                    src="/logo.png"
                    fill
                    layout="fill"
                    objectFit="cover"
                    alt="Property image"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-light">Thông báo 3</h3>
                  <p className="text-sm font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla porttitor accumsan t
                  incidunt.</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-light">1 ngày trước</p>
              </div>
            </div>
          </div>
          <div className="border">
            <div className="flex flex-row items-center justify-between gap-2 border p-2">
              <div className="flex flex-row items-center gap-2">
                <div className="relative w-[120px] aspect-video">
                  <Image
                    src="/logo.png"
                    fill
                    layout="fill"
                    objectFit="cover"
                    alt="Property image"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-light">Thông báo 4</h3>
                  <p className="text-sm font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla porttitor accumsan t
                  incidunt.</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-light">2 ng
                ày trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
