"use client";

import { useState, useEffect, useRef } from "react";

export default function PhoneNumberGame() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [phoneDigits, setPhoneDigits] = useState<number[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [phaseKey, setPhaseKey] = useState(0);

  const handlePhaseComplete = (digit: number) => {
    const newDigits = [...phoneDigits, digit];
    setPhoneDigits(newDigits);

    if (currentPhase >= 10) {
      setGameCompleted(true);
    } else {
      setCurrentPhase(currentPhase + 1);
      setPhaseKey((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentPhase(1);
    setPhoneDigits([]);
    setGameCompleted(false);
    setPhaseKey(0);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
          <h1 className="text-6xl font-bold text-white mb-6">🎉 SUCCESS!</h1>
          <p className="text-2xl text-white mb-8">
            Your Generated Phone Number:
          </p>
          <div className="text-6xl font-mono font-bold text-yellow-400 mb-8 tracking-wider">
            ({phoneDigits.slice(0, 3).join("")}){" "}
            {phoneDigits.slice(3, 6).join("")}-
            {phoneDigits.slice(6, 10).join("")}
          </div>
          <button
            onClick={resetGame}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all"
          >
            Generate New Number
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          📱 Phone Number Input
        </h1>
        <div className="text-2xl text-white mb-4">
          Phase {currentPhase}/10 - Get Digit {currentPhase}
        </div>
        <div className="text-3xl font-mono text-blue-300 mb-6">
          {phoneDigits.map((digit, idx) => (
            <span key={idx} className="inline-block w-8 text-yellow-400">
              {digit}
            </span>
          ))}
          {Array.from({ length: 10 - phoneDigits.length }, (_, idx) => (
            <span
              key={`empty-${idx}`}
              className="inline-block w-8 text-gray-500"
            >
              _
            </span>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <PhaseSelector
          key={phaseKey}
          phase={currentPhase}
          onComplete={handlePhaseComplete}
        />
      </div>
    </div>
  );
}

function PhaseSelector({
  phase,
  onComplete,
}: {
  phase: number;
  onComplete: (digit: number) => void;
}) {
  switch (phase) {
    case 1:
      return <Phase1_CannonShot onComplete={onComplete} />;
    case 2:
      return <Phase2_NumberMaze onComplete={onComplete} />;
    case 3:
      return <Phase3_MemoryTiles onComplete={onComplete} />;
    case 4:
      return <Phase4_SpinWheel onComplete={onComplete} />;
    case 5:
      return <Phase5_TargetShooting onComplete={onComplete} />;
    case 6:
      return <Phase6_PuzzleSolve onComplete={onComplete} />;
    case 7:
      return <Phase7_ParkourJump onComplete={onComplete} />;
    case 8:
      return <Phase8_FishingGame onComplete={onComplete} />;
    case 9:
      return <Phase9_RhythmTap onComplete={onComplete} />;
    case 10:
      return <Phase10_FinalBoss onComplete={onComplete} />;
    default:
      return <div>Unknown Phase</div>;
  }
}

// PHASE 1: CANNON SHOT (Angry Birds Style)
function Phase1_CannonShot({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boxes, setBoxes] = useState<
    Array<{
      digit: number;
      x: number;
      y: number;
      width: number;
      height: number;
      hit: boolean;
    }>
  >(() => {
    // Create accessible horizontal rows of boxes with digits 0-9
    const positions = [
      // Top row (5 boxes): 5,6,7,8,9
      { x: 200, y: 150, digit: 5 },
      { x: 280, y: 150, digit: 6 },
      { x: 360, y: 150, digit: 7 },
      { x: 440, y: 150, digit: 8 },
      { x: 520, y: 150, digit: 9 },
      // Bottom row (5 boxes): 0,1,2,3,4
      { x: 200, y: 300, digit: 0 },
      { x: 280, y: 300, digit: 1 },
      { x: 360, y: 300, digit: 2 },
      { x: 440, y: 300, digit: 3 },
      { x: 520, y: 300, digit: 4 },
    ];

    return positions.map((pos) => ({
      digit: pos.digit,
      x: pos.x,
      y: pos.y,
      width: 80,
      height: 60,
      hit: false,
    }));
  });
  const [cannonball, setCannonball] = useState({
    x: 110,
    y: 390,
    vx: 0,
    vy: 0,
    fired: false,
  });
  const [angle, setAngle] = useState(0);
  const [power, setPower] = useState(0);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, 800, 500);

      // Draw cannon
      ctx.save();
      ctx.translate(110, 390);
      ctx.rotate(angle);
      ctx.fillStyle = "#333";
      ctx.fillRect(-10, -10, 70, 20);
      ctx.restore();

      // Draw boxes
      boxes.forEach((box) => {
        if (!box.hit) {
          // Draw box shadow
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.fillRect(box.x + 3, box.y + 3, box.width, box.height);

          // Draw main box
          ctx.fillStyle = "#4F46E5";
          ctx.fillRect(box.x, box.y, box.width, box.height);

          // Draw box border
          ctx.strokeStyle = "#1E1B4B";
          ctx.lineWidth = 3;
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          // Draw collision area (debug - light outline)
          ctx.strokeStyle = "rgba(255,255,0,0.3)";
          ctx.lineWidth = 1;
          ctx.strokeRect(
            box.x - 10,
            box.y - 10,
            box.width + 20,
            box.height + 20,
          );

          // Draw number
          ctx.fillStyle = "white";
          ctx.font = "bold 32px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            box.digit.toString(),
            box.x + box.width / 2,
            box.y + box.height / 2,
          );
        } else {
          // Draw broken box effect
          ctx.fillStyle = "rgba(255,0,0,0.5)";
          ctx.fillRect(box.x, box.y, box.width, box.height);
          ctx.fillStyle = "white";
          ctx.font = "bold 20px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💥", box.x + box.width / 2, box.y + box.height / 2);
        }
      });

      // Draw cannonball
      if (cannonball.fired) {
        // Draw cannonball shadow
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.arc(cannonball.x + 2, cannonball.y + 2, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw cannonball
        ctx.fillStyle = "#FF4444";
        ctx.beginPath();
        ctx.arc(cannonball.x, cannonball.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw cannonball highlight
        ctx.fillStyle = "#FF8888";
        ctx.beginPath();
        ctx.arc(cannonball.x - 2, cannonball.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw power meter
      if (charging) {
        // Power meter background
        ctx.fillStyle = "#333";
        ctx.fillRect(100, 450, 300, 20);

        // Power meter fill
        const powerWidth = (power / 100) * 300;
        const gradient = ctx.createLinearGradient(100, 450, 400, 450);
        gradient.addColorStop(0, "#00FF00");
        gradient.addColorStop(0.5, "#FFFF00");
        gradient.addColorStop(1, "#FF0000");
        ctx.fillStyle = gradient;
        ctx.fillRect(100, 450, powerWidth, 20);

        // Power meter border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 450, 300, 20);

        // Power text
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Power: ${Math.round(power)}%`, 250, 485);
      }

      // Draw crosshair
      if (!cannonball.fired) {
        const mouseEndX = 110 + Math.cos(angle) * 120;
        const mouseEndY = 390 + Math.sin(angle) * 120;
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(110, 390);
        ctx.lineTo(mouseEndX, mouseEndY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw debug info
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Angle: ${((angle * 180) / Math.PI).toFixed(1)}°`, 10, 20);
      ctx.fillText(`Ball: ${cannonball.fired ? "FIRED" : "READY"}`, 10, 35);
      ctx.fillText(`Power: ${Math.round(power)}%`, 10, 50);

      requestAnimationFrame(animate);
    };
    animate();
  }, [cannonball, boxes, angle, power, charging]);

  useEffect(() => {
    if (!cannonball.fired) return;

    const moveCannonball = () => {
      setCannonball((prev) => {
        const newX = prev.x + prev.vx;
        const newY = prev.y + prev.vy;
        const newVY = prev.vy + 0.5; // gravity

        // Check if cannonball is out of bounds
        if (newX < 0 || newX > 800 || newY > 500) {
          // Reset cannonball
          setTimeout(() => {
            setCannonball({ x: 110, y: 390, vx: 0, vy: 0, fired: false });
            setPower(0);
          }, 1000);
          return prev;
        }

        // Check collisions with boxes - use current boxes state
        for (const box of boxes) {
          if (
            !box.hit &&
            newX >= box.x - 8 &&
            newX <= box.x + box.width + 8 &&
            newY >= box.y - 8 &&
            newY <= box.y + box.height + 8
          ) {
            // Mark box as hit immediately
            setBoxes((prevBoxes) =>
              prevBoxes.map((b) =>
                b.digit === box.digit ? { ...b, hit: true } : b,
              ),
            );
            // Complete with this digit after short delay
            setTimeout(() => {
              onComplete(box.digit);
            }, 300);
            // Return stopped cannonball position
            return { x: newX, y: newY, vx: 0, vy: 0, fired: false };
          }
        }

        return { ...prev, x: newX, y: newY, vy: newVY };
      });
    };

    const interval = setInterval(moveCannonball, 16);
    return () => clearInterval(interval);
  }, [cannonball.fired, boxes, onComplete]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cannonball.fired || charging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const newAngle = Math.atan2(mouseY - 390, mouseX - 110);
    // Limit angle to reasonable range (no shooting backwards or too steep)
    if (newAngle >= -Math.PI / 2 && newAngle <= Math.PI / 4) {
      setAngle(newAngle);
    }
  };

  const handleMouseDown = () => {
    if (cannonball.fired || charging) return;
    setCharging(true);

    let currentPower = 20;
    setPower(currentPower);

    const chargeInterval = setInterval(() => {
      currentPower += 3;
      if (currentPower > 100) {
        currentPower = 20; // Reset to minimum
      }
      setPower(currentPower);
    }, 60);

    const handleMouseUp = () => {
      setCharging(false);
      clearInterval(chargeInterval);

      const velocity = Math.max(10, Math.min(35, currentPower / 2));

      setCannonball({
        x: 110, // Start from cannon tip
        y: 390,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        fired: true,
      });

      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🎯 Phase 1: Cannon Shot
      </h2>
      <p className="text-white mb-4">
        Aim and fire at the box with your desired digit!
      </p>
      <p className="text-yellow-300 mb-6 text-sm">
        📋 Layout: Top row (5-9) • Bottom row (0-4) • All digits reachable!
      </p>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border-2 border-white rounded-lg bg-sky-200 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      />
      <div className="mt-4">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCannonball({ x: 110, y: 390, vx: 0, vy: 0, fired: false });
              setPower(0);
              setCharging(false);
              setBoxes((prevBoxes) =>
                prevBoxes.map((box) => ({ ...box, hit: false })),
              );
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🔄 Reset Cannon
          </button>
          <div className="text-white text-sm py-2">
            <p className="mb-1">🎯 Aim: Move mouse to target boxes</p>
            <p className="mb-1">
              ⚡ Power: Hold mouse button, watch meter fill
            </p>
            <p>🔥 Fire: Release mouse button to shoot!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// PHASE 2: NUMBER MAZE
function Phase2_NumberMaze({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [digitOrbs, setDigitOrbs] = useState(() => {
    const orbs = [];
    const maze = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    // Place orbs only in valid empty spaces
    const validPositions = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0 && !(x === 1 && y === 1)) {
          // Not player start
          validPositions.push({ x, y });
        }
      }
    }

    // Shuffle and take first 10 positions
    for (let i = validPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [validPositions[i], validPositions[j]] = [
        validPositions[j],
        validPositions[i],
      ];
    }

    for (let i = 0; i <= 9; i++) {
      const pos = validPositions[i] || { x: 14, y: 9 }; // fallback
      orbs.push({
        digit: i,
        x: pos.x,
        y: pos.y,
        collected: false,
      });
    }
    return orbs;
  });

  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newPos = { ...playerPos };
      switch (e.key) {
        case "ArrowUp":
          newPos.y -= 1;
          break;
        case "ArrowDown":
          newPos.y += 1;
          break;
        case "ArrowLeft":
          newPos.x -= 1;
          break;
        case "ArrowRight":
          newPos.x += 1;
          break;
      }

      if (maze[newPos.y] && maze[newPos.y][newPos.x] === 0) {
        setPlayerPos(newPos);

        // Check orb collection
        const hitOrb = digitOrbs.find(
          (orb) => !orb.collected && orb.x === newPos.x && orb.y === newPos.y,
        );
        if (hitOrb) {
          setDigitOrbs((prev) =>
            prev.map((orb) =>
              orb.digit === hitOrb.digit ? { ...orb, collected: true } : orb,
            ),
          );
          onComplete(hitOrb.digit);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPos, onComplete]);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🔍 Phase 2: Number Maze
      </h2>
      <p className="text-white mb-4">
        Navigate to collect the digit you want! Use arrow keys.
      </p>
      <p className="text-yellow-300 mb-6 text-sm">
        ↑↓←→ Arrow keys to move • Touch any yellow orb to collect its digit
      </p>

      <div className="inline-block bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-16 gap-0" style={{ fontSize: "12px" }}>
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const orb = digitOrbs.find(
                (o) => o.x === x && o.y === y && !o.collected,
              );

              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                    cell === 1
                      ? "bg-gray-900"
                      : isPlayer
                        ? "bg-red-500 text-white"
                        : orb
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-700"
                  }`}
                >
                  {isPlayer ? "●" : orb ? orb.digit : ""}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

// PHASE 3: MEMORY TILES
function Phase3_MemoryTiles({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [cards, setCards] = useState(() => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pairs = [...digits, ...digits].sort(() => Math.random() - 0.5);
    return pairs.map((digit, i) => ({
      id: i,
      digit,
      flipped: false,
      matched: false,
    }));
  });
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [canFlip, setCanFlip] = useState(true);

  const handleCardClick = (id: number) => {
    if (
      !canFlip ||
      cards[id].flipped ||
      cards[id].matched ||
      flippedCards.length >= 2
    )
      return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      setTimeout(() => {
        const [first, second] = newFlipped;
        if (newCards[first].digit === newCards[second].digit) {
          newCards[first].matched = true;
          newCards[second].matched = true;
          onComplete(newCards[first].digit);
        } else {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
        }
        setCards([...newCards]);
        setFlippedCards([]);
        setCanFlip(true);
      }, 1000);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🧠 Phase 3: Memory Match
      </h2>
      <p className="text-white mb-4">
        Find any matching pair to get that digit!
      </p>
      <p className="text-yellow-300 mb-6 text-sm">
        Click cards to flip them • Match two identical numbers to win that digit
      </p>

      <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-16 h-16 text-xl font-bold rounded-lg transition-all ${
              card.matched
                ? "bg-green-500 text-white"
                : card.flipped
                  ? "bg-blue-500 text-white"
                  : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            {card.flipped || card.matched ? card.digit : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}

// PHASE 4: SPIN WHEEL
function Phase4_SpinWheel({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const selectDigit = (digit: number) => {
    if (spinning) return;
    setResult(digit);
    onComplete(digit);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🎯 Phase 4: Number Selection
      </h2>
      <p className="text-white mb-4">Click any number you want!</p>
      <p className="text-yellow-300 mb-6 text-sm">
        Simply click the digit you want for your phone number
      </p>

      <div className="grid grid-cols-5 gap-4 max-w-lg mx-auto">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => selectDigit(num)}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all shadow-lg"
          >
            {num}
          </button>
        ))}
      </div>

      {result !== null && (
        <p className="text-2xl text-yellow-400 mt-4">Selected: {result}</p>
      )}
    </div>
  );
}

// PHASE 5: TARGET SHOOTING
function Phase5_TargetShooting({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [targets, setTargets] = useState(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      digit: i,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: 40 + Math.random() * 20,
      hit: false,
    }));
  });
  const [bullets, setBullets] = useState<
    Array<{ x: number; y: number; vx: number; vy: number }>
  >([]);

  useEffect(() => {
    const moveTargets = setInterval(() => {
      setTargets((prev) =>
        prev.map((target) => {
          if (target.hit) return target;
          let newX = target.x + target.vx;
          let newY = target.y + target.vy;
          let newVx = target.vx;
          let newVy = target.vy;

          if (newX <= 0 || newX >= 500) newVx = -newVx;
          if (newY <= 0 || newY >= 400) newVy = -newVy;

          return { ...target, x: newX, y: newY, vx: newVx, vy: newVy };
        }),
      );
    }, 50);

    return () => clearInterval(moveTargets);
  }, []);

  useEffect(() => {
    const moveBullets = setInterval(() => {
      setBullets((prev) =>
        prev.filter((bullet) => {
          bullet.x += bullet.vx;
          bullet.y += bullet.vy;

          // Check collisions
          setTargets((prevTargets) => {
            const newTargets = [...prevTargets];
            newTargets.forEach((target) => {
              if (
                !target.hit &&
                Math.hypot(bullet.x - target.x, bullet.y - target.y) <
                  target.size / 2
              ) {
                target.hit = true;
                onComplete(target.digit);
              }
            });
            return newTargets;
          });

          return (
            bullet.x > 0 && bullet.x < 500 && bullet.y > 0 && bullet.y < 400
          );
        }),
      );
    }, 20);

    return () => clearInterval(moveBullets);
  }, [onComplete]);

  const handleShoot = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;

    const angle = Math.atan2(targetY - 400, targetX - 250);
    setBullets((prev) => [
      ...prev,
      {
        x: 250,
        y: 400,
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8,
      },
    ]);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🔫 Phase 5: Target Shooting
      </h2>
      <p className="text-white mb-4">
        Click to shoot the target with your desired number!
      </p>
      <p className="text-yellow-300 mb-6 text-sm">
        Click anywhere to shoot • Hit the moving target with the digit you want
      </p>

      <div
        className="relative mx-auto bg-sky-300 border-2 border-white rounded-lg cursor-crosshair"
        style={{ width: "500px", height: "400px" }}
        onClick={handleShoot}
      >
        {targets.map((target, i) => (
          <div
            key={i}
            className={`absolute rounded-full font-bold text-white text-xl flex items-center justify-center ${
              target.hit ? "bg-gray-500" : "bg-red-600"
            }`}
            style={{
              left: target.x - target.size / 2,
              top: target.y - target.size / 2,
              width: target.size,
              height: target.size,
              opacity: target.hit ? 0.5 : 1,
            }}
          >
            {target.digit}
          </div>
        ))}

        {bullets.map((bullet, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{ left: bullet.x, top: bullet.y }}
          />
        ))}

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
}

// PHASE 6: PUZZLE SOLVE
function Phase6_PuzzleSolve({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [puzzle, setPuzzle] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Scramble puzzle
    const scrambled = [...puzzle];
    for (let i = 0; i < 100; i++) {
      const emptyIndex = scrambled.indexOf(0);
      const validMoves = [];
      if (emptyIndex % 3 !== 0) validMoves.push(emptyIndex - 1);
      if (emptyIndex % 3 !== 2) validMoves.push(emptyIndex + 1);
      if (emptyIndex >= 3) validMoves.push(emptyIndex - 3);
      if (emptyIndex < 6) validMoves.push(emptyIndex + 3);

      const randomMove =
        validMoves[Math.floor(Math.random() * validMoves.length)];
      [scrambled[emptyIndex], scrambled[randomMove]] = [
        scrambled[randomMove],
        scrambled[emptyIndex],
      ];
    }
    setPuzzle(scrambled);
  }, []);

  const moveTile = (index: number) => {
    const emptyIndex = puzzle.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const canMove =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (canMove) {
      const newPuzzle = [...puzzle];
      [newPuzzle[index], newPuzzle[emptyIndex]] = [
        newPuzzle[emptyIndex],
        newPuzzle[index],
      ];
      setPuzzle(newPuzzle);
      setMoves((prev) => prev + 1);

      // Check if solved
      const solved = newPuzzle.every((tile, i) => {
        if (i === 8) return tile === 0;
        return tile === i + 1;
      });

      if (solved) {
        // Show digit selection after solving
        setTimeout(() => {
          const digit = prompt(
            "Puzzle solved! Enter your desired digit (0-9):",
          );
          const parsedDigit = parseInt(digit || "0");
          if (parsedDigit >= 0 && parsedDigit <= 9) {
            onComplete(parsedDigit);
          } else {
            onComplete(0);
          }
        }, 500);
      }
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🧩 Phase 6: Sliding Puzzle
      </h2>
      <p className="text-white mb-4">
        Solve the puzzle, then choose your digit!
      </p>
      <p className="text-yellow-300 mb-6 text-sm">
        Click tiles to move them • Get numbers 1-8 in order • Choose your digit
        after solving
      </p>
      <p className="text-yellow-400 mb-4">Moves: {moves}</p>

      <div className="inline-block bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-1 w-48 h-48">
          {puzzle.map((tile, index) => (
            <div
              key={index}
              onClick={() => tile !== 0 && moveTile(index)}
              className={`
                w-15 h-15 flex items-center justify-center text-xl font-bold rounded cursor-pointer
                ${tile === 0 ? "bg-gray-800" : "bg-blue-600 hover:bg-blue-500 text-white"}
              `}
            >
              {tile !== 0 && tile}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// PHASE 7: PARKOUR JUMP
function Phase7_ParkourJump({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(300);
  const [velocityY, setVelocityY] = useState(0);
  const [onGround, setOnGround] = useState(true);
  const [platforms] = useState(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      digit: i,
      x: 100 + i * 60,
      y: 200 + Math.sin(i) * 100,
      width: 50,
      height: 20,
    }));
  });

  useEffect(() => {
    const gravity = 0.8;
    const gameLoop = setInterval(() => {
      setPlayerY((prev) => {
        const newY = prev + velocityY;
        setVelocityY((prevV) => prevV + gravity);

        // Ground collision
        if (newY >= 300) {
          setOnGround(true);
          setVelocityY(0);
          return 300;
        }

        // Platform collision
        let landed = false;
        platforms.forEach((platform) => {
          if (
            playerX > platform.x - 25 &&
            playerX < platform.x + platform.width + 25 &&
            prev <= platform.y &&
            newY >= platform.y &&
            velocityY > 0
          ) {
            setOnGround(true);
            setVelocityY(0);
            setTimeout(() => onComplete(platform.digit), 100);
            landed = true;
          }
        });

        if (landed)
          return (
            platforms.find(
              (p) => playerX > p.x - 25 && playerX < p.x + p.width + 25,
            )?.y || 300
          );

        setOnGround(false);
        return newY;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [velocityY, playerX, platforms, onComplete]);

  const handleKeyPress = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "ArrowLeft") setPlayerX((prev) => Math.max(0, prev - 8));
    if (e.key === "ArrowRight") setPlayerX((prev) => Math.min(750, prev + 8));
    if ((e.key === " " || e.key === "ArrowUp") && onGround) {
      setVelocityY(-18);
      setOnGround(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onGround]);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🏃 Phase 7: Parkour Jump
      </h2>
      <p className="text-white mb-4">
        Jump on the platform with your desired number! Use arrows + spacebar.
      </p>
      <p className="text-yellow-300 mb-6 text-sm">
        ←→ Move left/right • ↑ or Space to jump • Land on platform with your
        desired digit
      </p>

      <div
        className="relative mx-auto bg-sky-200 border-2 border-white rounded-lg"
        style={{ width: "800px", height: "400px" }}
      >
        {/* Player */}
        <div
          className="absolute w-6 h-6 bg-red-600 rounded-full"
          style={{ left: playerX - 3, top: playerY - 3 }}
        />

        {/* Platforms */}
        {platforms.map((platform, i) => (
          <div
            key={i}
            className="absolute bg-green-600 flex items-center justify-center text-white font-bold"
            style={{
              left: platform.x,
              top: platform.y,
              width: platform.width,
              height: platform.height,
            }}
          >
            {platform.digit}
          </div>
        ))}

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-4 bg-brown-600 bg-amber-800"></div>
      </div>
    </div>
  );
}

// PHASE 8: FISHING GAME
function Phase8_FishingGame({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [fishPosition, setFishPosition] = useState({ x: 200, y: 150 });
  const [hookPosition, setHookPosition] = useState({ x: 400, y: 50 });
  const [fishing, setFishing] = useState(false);
  const [caught, setCaught] = useState(false);
  const [fishDigits] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      digit: i,
      x: 100 + (i % 5) * 80,
      y: 200 + Math.floor(i / 5) * 80,
      caught: false,
    })),
  );
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);

  const catchFish = (digit: number) => {
    setSelectedDigit(digit);
    onComplete(digit);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🎣 Phase 8: Digital Fishing
      </h2>
      <p className="text-white mb-4">
        Click on any fish to catch it and get its number!
      </p>
      <p className="text-yellow-300 mb-6 text-sm">
        Click the fish with the digit you want • Each fish has a different
        number
      </p>

      <div
        className="relative mx-auto bg-blue-300 border-2 border-white rounded-lg"
        style={{ width: "600px", height: "400px" }}
      >
        {/* Fish with numbers */}
        {fishDigits.map((fish) => (
          <button
            key={fish.digit}
            onClick={() => catchFish(fish.digit)}
            disabled={fish.caught}
            className={`absolute w-16 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl transform rotate-12 hover:scale-110 transition-all ${
              fish.caught
                ? "bg-gray-400 opacity-50"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            style={{ left: fish.x, top: fish.y }}
          >
            🐟{fish.digit}
          </button>
        ))}

        {selectedDigit !== null && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-yellow-400">
            🎉 CAUGHT {selectedDigit}! 🎉
          </div>
        )}
      </div>
    </div>
  );
}

// PHASE 9: RHYTHM TAP
function Phase9_RhythmTap({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState<
    Array<{ id: number; lane: number; y: number }>
  >([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [nextNoteId, setNextNoteId] = useState(0);

  useEffect(() => {
    if (!gameStarted) return;

    const spawnNote = setInterval(() => {
      setNotes((prev) => [
        ...prev,
        {
          id: nextNoteId,
          lane: Math.floor(Math.random() * 4),
          y: 0,
        },
      ]);
      setNextNoteId((prev) => prev + 1);
    }, 800);

    return () => clearInterval(spawnNote);
  }, [gameStarted, nextNoteId]);

  useEffect(() => {
    if (!gameStarted) return;

    const moveNotes = setInterval(() => {
      setNotes((prev) =>
        prev
          .map((note) => ({ ...note, y: note.y + 5 }))
          .filter((note) => note.y < 400),
      );
    }, 50);

    return () => clearInterval(moveNotes);
  }, [gameStarted]);

  const hitNote = (lane: number) => {
    const targetNote = notes.find(
      (note) => note.lane === lane && note.y > 300 && note.y < 380,
    );
    if (targetNote) {
      const newScore = score + 1;
      setScore(newScore);
      setNotes((prev) => prev.filter((note) => note.id !== targetNote.id));

      if (newScore >= 10) {
        // Let user choose their digit after completing rhythm game
        setTimeout(() => {
          const digit = prompt("Great rhythm! Choose your digit (0-9):");
          const parsedDigit = parseInt(digit || "0");
          if (parsedDigit >= 0 && parsedDigit <= 9) {
            onComplete(parsedDigit);
          } else {
            onComplete(0);
          }
        }, 500);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!gameStarted) return;
    e.preventDefault();
    switch (e.key.toLowerCase()) {
      case "a":
        hitNote(0);
        break;
      case "s":
        hitNote(1);
        break;
      case "d":
        hitNote(2);
        break;
      case "f":
        hitNote(3);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, notes, score]);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🎵 Phase 9: Rhythm Tap
      </h2>
      <p className="text-white mb-4">
        Hit 10 notes, then choose your digit! Use A-S-D-F keys.
      </p>
      <p className="text-yellow-300 mb-4 text-sm">
        A-S-D-F keys for lanes • Hit notes when they reach the green zone • Get
        10 hits to proceed
      </p>
      <p className="text-yellow-400 mb-6">Score: {score}/10</p>

      {!gameStarted ? (
        <button
          onClick={() => setGameStarted(true)}
          className="px-8 py-4 bg-purple-600 text-white text-xl font-bold rounded-xl hover:bg-purple-700"
        >
          🎵 Start Rhythm Game
        </button>
      ) : (
        <div
          className="relative mx-auto bg-gray-900 border-2 border-white rounded-lg"
          style={{ width: "400px", height: "400px" }}
        >
          {/* Lanes */}
          {[0, 1, 2, 3].map((lane) => (
            <div
              key={lane}
              className="absolute border-r border-gray-600"
              style={{ left: lane * 100, width: 100, height: "100%" }}
            />
          ))}

          {/* Hit zone */}
          <div
            className="absolute w-full h-8 bg-green-500 opacity-50"
            style={{ top: 340 }}
          ></div>

          {/* Notes */}
          {notes.map((note) => (
            <div
              key={note.id}
              className="absolute w-16 h-8 bg-blue-500 rounded-lg border-2 border-white flex items-center justify-center text-white font-bold"
              style={{ left: note.lane * 100 + 20, top: note.y }}
            >
              ♪
            </div>
          ))}

          {/* Key hints */}
          <div className="absolute bottom-2 w-full flex justify-between px-4">
            {["A", "S", "D", "F"].map((key, i) => (
              <div
                key={i}
                className="w-12 h-8 bg-gray-700 text-white flex items-center justify-center rounded font-bold"
              >
                {key}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// PHASE 10: FINAL BOSS
function Phase10_FinalBoss({
  onComplete,
}: {
  onComplete: (digit: number) => void;
}) {
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);

  const selectFinalDigit = (digit: number) => {
    setSelectedDigit(digit);
    setTimeout(() => onComplete(digit), 1000);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        🏆 Phase 10: FINAL CHOICE
      </h2>
      <p className="text-white mb-4">
        Choose your final digit to complete your phone number!
      </p>
      <p className="text-yellow-300 mb-6 text-sm">
        This is your last digit choice • Pick wisely to complete your 10-digit
        phone number
      </p>

      <div className="mb-8">
        <div className="text-8xl mb-4">🎯</div>
        <h3 className="text-2xl text-yellow-400 font-bold mb-6">
          SELECT YOUR FINAL DIGIT
        </h3>
      </div>

      <div className="grid grid-cols-5 gap-4 max-w-lg mx-auto mb-8">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => selectFinalDigit(num)}
            disabled={selectedDigit !== null}
            className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 text-black text-3xl font-bold rounded-2xl hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-110 transition-all shadow-lg border-2 border-yellow-300 disabled:opacity-50"
          >
            {num}
          </button>
        ))}
      </div>

      {selectedDigit !== null && (
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-4xl text-yellow-400 font-bold mb-4">
            FINAL DIGIT SELECTED!
          </h3>
          <p className="text-2xl text-white">Your choice: {selectedDigit}</p>
        </div>
      )}
    </div>
  );
}
