// Wraps the event-based Sensor API in a promise so it fits FingerprintData.resolve.
export function resolveSensor(name: string): () => Promise<string> {
  return () => new Promise<string>(resolve => {
    if (!(name in window)) {
      resolve('Not supported');
      return;
    }

    try {
      const SensorClass: any = (window as any)[name];
      const sensor = new SensorClass({ frequency: 1 });
      let settled = false;
      const done = (value: string) => {
        if (settled) return;
        settled = true;
        sensor.stop();
        resolve(value);
      };

      sensor.addEventListener('reading', () => done('Available'));
      sensor.addEventListener('error', () => done('Blocked or No Permission'));
      sensor.start();

      setTimeout(() => {
        done('Blocked / Requires Permission');
      }, 500);
    } catch (err: any) {
      resolve(err?.name === 'SecurityError' ? 'Permission Required' : 'Blocked');
    }
  });
}
