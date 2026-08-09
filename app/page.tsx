"use client";

import { useMemo, useState } from "react";
import { trips, type Trip } from "./trip-data";
import { tripMedia } from "./trip-media";


const countryNames: Record<string, string> = {
  TH: "ไทย", CN: "จีน", VN: "เวียดนาม", NP: "เนปาล", LA: "ลาว",
  MM: "เมียนมา", ID: "อินโดนีเซีย", JP: "ญี่ปุ่น", KZ: "คาซัคสถาน",
  MY: "มาเลเซีย", HK: "ฮ่องกง",
};

const forms = {
  "ต่างประเทศ": "https://forms.gle/3gBxbRzB8h6pCiUX9",
  "ในประเทศ": "https://forms.gle/VmqBhkGDQyjJrQKJ7",
};

const fireSalePromos = [
  {
    tripName: "เขาอู่กง",
    oldPrice: "14,990",
    promoPrice: "9,600",
    note: "10–13 ก.ย. 69 · 16–19 ต.ค. 69 · 16–19 ม.ค. 70",
  },
];

const hiddenTripNames = new Set(["หุบเขาเสือกระโจน", "ป่าลับ", "สันเย็น จ.สุราษฎร์ฯ"]);
const availableTrips = Array.from(
  trips
    .filter((trip) => !hiddenTripNames.has(trip.name))
    .reduce((byName, trip) => {
      const current = byName.get(trip.name);
      if (!current || (trip.name === "เขาอู่กง" && trip.price === "9,600")) {
        byName.set(trip.name, trip);
      }
      return byName;
    }, new Map<string, Trip>())
    .values(),
);

function TripCard({ trip, onOpen }: { trip: Trip; onOpen: (trip: Trip) => void }) {
  const cover = tripMedia[trip.name]?.[0];
  return (
    <article className="trip-card">
      <button
        className={`trip-visual ${cover ? "has-photo" : ""}`}
        onClick={() => onOpen(trip)}
        aria-label={`ดูรายละเอียด ${trip.name}`}
        style={cover ? { backgroundImage: `url("${cover}")` } : undefined}
      >
        <span className="country-mark">{trip.code}</span>
        {!cover && <span className="visual-mountain" />}
        {!cover && <span className="image-status">รอรูปจาก PDF / Boss</span>}
      </button>
      <div className="trip-body">
        <div className="trip-kicker">{trip.place || countryNames[trip.code]}</div>
        <h3>{trip.name}</h3>
        <p className="dates">{trip.dates}</p>
        <div className="price-row">
          <div><small>เริ่มต้น</small><strong>{trip.price ? `฿${trip.price}` : "รอยืนยันราคา"}</strong></div>
          <button className="details-button" onClick={() => onOpen(trip)}>รายละเอียด</button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [active, setActive] = useState<"ทั้งหมด" | "ต่างประเทศ" | "ในประเทศ">("ทั้งหมด");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Trip | null>(null);
  const searchTrips = (value: string, moveToResults = false) => {
    setQuery(value);
    if (moveToResults && value.trim()) {
      window.setTimeout(() => document.getElementById("trips")?.scrollIntoView({ behavior: "smooth" }), 120);
    }
  };
  const visibleTrips = useMemo(() => availableTrips.filter((trip) => {
    const typeMatch = active === "ทั้งหมด" || trip.type === active;
    const word = `${trip.name} ${trip.place || ""} ${countryNames[trip.code]}`.toLowerCase();
    return typeMatch && word.includes(query.trim().toLowerCase());
  }), [active, query]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Weena Tour หน้าแรก">
          <span className="brand-wordmark">Weena</span>
          <span className="brand-divider" />
          <span className="brand-caption">NATURE · ADVENTURE · MEMORIES</span>
        </a>
        <nav>
          <a href="#trips">ทริปทั้งหมด</a>
          <a href="#company">เกี่ยวกับเรา</a>
          <a className="line-link" href="https://lin.ee/WcSB5VV" target="_blank" rel="noreferrer">LINE @weena2d1n</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <img className="hero-cover" src="/weena-cover.png" alt="เข้าป่า Two Days One Night Trip และ Weena ท่ามกลางวิวภูเขา" />
        <div className="hero-shade" />
        <div className="hero-search-panel">
          <div className="hero-search-copy">
            <span>FIND YOUR NEXT JOURNEY</span>
            <h1>ค้นหาทริปที่อยากไป</h1>
          </div>
          <label className="hero-search">
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => searchTrips(e.target.value, true)}
              placeholder="พิมพ์ชื่อทริป ประเทศ หรือจังหวัด เช่น อู่กง, เชียงใหม่"
              aria-label="ค้นหาทริปจากหน้าปก"
            />
            <b>{availableTrips.length} TRIPS</b>
          </label>
        </div>
      </section>

      <section className="pinned-promos" aria-labelledby="fire-sale-title">
        <div className="promo-heading">
          <div>
            <p className="eyebrow">PINNED DEALS</p>
            <h2 id="fire-sale-title">โปรไฟไหม้ <em>จำนวนจำกัด!</em></h2>
          </div>
          <p>ราคาพิเศษมีจำนวนจำกัด กรุณาตรวจสอบที่นั่งกับทีม Weena ก่อนจอง</p>
        </div>
        <div className="promo-grid">
          {fireSalePromos.map((promo) => {
            const trip = availableTrips.find((item) => item.name === promo.tripName && (
              promo.tripName !== "เขาอู่กง" || item.price === "9,600"
            ));
            if (!trip) return null;
            const promoCover = tripMedia[trip.name]?.[0];
            return (
              <article className="promo-card" key={promo.tripName}>
                <button
                  className={`promo-image ${promoCover ? "has-photo" : ""}`}
                  style={promoCover ? { backgroundImage: `url("${promoCover}")` } : undefined}
                  onClick={() => setSelected({ ...trip, price: promo.promoPrice })}
                  aria-label={`ดูโปร ${trip.name}`}
                >
                  <span className="pin-badge">PIN POST</span>
                  {!promoCover && <span className="promo-image-note">รอรูปโปรโมชันจาก Boss</span>}
                </button>
                <div className="promo-info">
                  <div>
                    <p>{trip.place || countryNames[trip.code]} · {trip.type}</p>
                    <h3>{trip.name}</h3>
                    <span>{promo.note}</span>
                  </div>
                  <div className="promo-price">
                    <del>฿{promo.oldPrice}</del>
                    <strong>฿{promo.promoPrice}</strong>
                    <button onClick={() => setSelected({ ...trip, price: promo.promoPrice })}>ดูรายละเอียด →</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="trip-directory" id="trips">
        <div className="toolbar">
          <div className="tabs">
            {(["ทั้งหมด", "ต่างประเทศ", "ในประเทศ"] as const).map((tab) => (
              <button key={tab} className={active === tab ? "active" : ""} onClick={() => setActive(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <p className="toolbar-note">ดูทริปทั้งหมด หรือใช้ช่องค้นหาบนภาพหน้าปก</p>
        </div>
        <div className="result-note">แสดง {visibleTrips.length} จาก {availableTrips.length} เส้นทาง</div>
        <div className="trip-grid">
          {visibleTrips.map((trip, index) => <TripCard key={`${trip.name}-${index}`} trip={trip} onOpen={setSelected} />)}
        </div>
        {!visibleTrips.length && <div className="empty">ไม่พบเส้นทางที่ค้นหา ลองใช้คำค้นอื่นอีกครั้ง</div>}
      </section>

      <section className="booking-band">
        <div>
          <p className="eyebrow">READY TO GO?</p>
          <h2>กรอกฟอร์มจองทริป</h2>
          <p>เลือกแบบฟอร์มให้ตรงกับประเภททริป ทีม Weena จะติดต่อกลับเพื่อยืนยันรอบและรายละเอียด</p>
        </div>
        <div className="booking-actions">
          <a href={forms["ต่างประเทศ"]} target="_blank" rel="noreferrer">ฟอร์มทริปต่างประเทศ <span>↗</span></a>
          <a href={forms["ในประเทศ"]} target="_blank" rel="noreferrer">ฟอร์มทริปไทย <span>↗</span></a>
        </div>
      </section>

      <section className="company" id="company">
        <div className="company-title">
          <p className="eyebrow">TRUSTED PARTNERSHIP</p>
          <h2>เที่ยวอย่างมั่นใจ<br />ถูกต้องตามกฎหมาย</h2>
          <div className="license">ใบอนุญาตประกอบธุรกิจนำเที่ยว<br /><strong>51/01141</strong></div>
        </div>
        <div className="company-copy">
          <p className="lead">บริษัท เข้าป่า Two Days One Night Trip ร่วมกับ Sichuan Jitu Holiday International Travel Agency Co., Ltd. บริษัทนำเที่ยวชั้นนำในประเทศจีนที่บริหารงานด้วยมาตรฐานสากล</p>
          <p>เราสร้างความร่วมมือระยะยาวและยกระดับมาตรฐานการบริการ โดยมุ่งเน้นความโปร่งใสและดำเนินธุรกิจอย่างถูกต้องตามกฎหมาย 100% มีสำนักงานและระบบบริหารงานร่วมกับพาร์ตเนอร์ต่างประเทศอย่างชัดเจน</p>
          <p><strong>Weena</strong> ตัวแทนบริษัท เข้าป่า Two Days One Night Trip รับจัดทริปท่องเที่ยว เดินป่า ทริปชิล Road trip และ Family trip ทั้ง Group, Private และ Joiner</p>
          <div className="contact-row">
            <a href="tel:0829287466"><span>โทรศัพท์</span>082-928-7466 (วีนา)</a>
            <a href="https://lin.ee/WcSB5VV" target="_blank" rel="noreferrer"><span>LINE OA</span>@weena2d1n</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-wordmark">Weena</span><span className="brand-divider" /><span className="brand-caption">NATURE · ADVENTURE · MEMORIES</span></div>
        <p>ตัวแทนบริษัท เข้าป่า Two Days One Night Trip</p>
        <a href="#top">กลับด้านบน ↑</a>
      </footer>

      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <section className="modal" role="dialog" aria-modal="true" aria-label={`รายละเอียด ${selected.name}`} onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="ปิด">×</button>
            <div className={`modal-gallery ${tripMedia[selected.name] ? "has-photos" : ""}`}>
              {(tripMedia[selected.name] || Array.from({ length: 6 }, () => "")).map((src, i) => (
                <div key={`${src}-${i}`} style={src ? { backgroundImage: `url("${src}")` } : undefined}>
                  <span>{i + 1}</span>
                  {!src && <small>รอรูปจาก PDF / Boss</small>}
                </div>
              ))}
            </div>
            <div className="modal-content">
              <p className="eyebrow">{selected.place || countryNames[selected.code]} · {selected.type}</p>
              <h2>{selected.name}</h2>
              {selected.summary && <p className="trip-summary">{selected.summary}</p>}
              <dl>
                <div><dt>รอบเดินทาง</dt><dd>{selected.dates}</dd></div>
                <div><dt>ราคาเริ่มต้น</dt><dd>{selected.price ? `฿${selected.price} / ท่าน` : "รอยืนยันราคา"}</dd></div>
              </dl>
              {!!selected.highlights.length && (
                <div className="detail-section">
                  <h3>ไฮไลต์ทริป</h3>
                  <ul>{selected.highlights.map((item, index) => <li key={index}>{item}</li>)}</ul>
                </div>
              )}
              {!!selected.itinerary.length && (
                <div className="detail-section itinerary-section">
                  <h3>โปรแกรมโดยย่อ</h3>
                  <ol>{selected.itinerary.map((item, index) => <li key={index}>{item}</li>)}</ol>
                </div>
              )}
              <div className="include-grid">
                {!!selected.includes.length && (
                  <div className="detail-section">
                    <h3>ราคานี้รวม</h3>
                    <ul className="check-list">{selected.includes.map((item, index) => <li key={index}>{item}</li>)}</ul>
                  </div>
                )}
                {!!selected.excludes.length && (
                  <div className="detail-section">
                    <h3>ราคานี้ไม่รวม</h3>
                    <ul className="cross-list">{selected.excludes.map((item, index) => <li key={index}>{item}</li>)}</ul>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <a href={forms[selected.type]} target="_blank" rel="noreferrer">จองทริปนี้ <span>↗</span></a>
                {selected.link && <a href={selected.link} target="_blank" rel="noreferrer" className="pdf-link">เปิดโปรแกรม PDF <span>↗</span></a>}
                <a href="https://lin.ee/WcSB5VV" target="_blank" rel="noreferrer" className="outline">สอบถามทาง LINE</a>
              </div>
              <p className="fine-print">ราคาและรอบเดินทางอาจเปลี่ยนแปลง กรุณาสอบถามและยืนยันกับทีม Weena ก่อนชำระเงิน</p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
