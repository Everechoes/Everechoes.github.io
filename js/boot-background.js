(function() {
  'use strict';

  const boot = document.getElementById('boot');
  const image = document.getElementById('boot-background-image');
  const video = document.getElementById('boot-background-video');
  const fileInput = document.getElementById('boot-background-file');
  const status = document.getElementById('boot-background-status');
  const removeButton = document.getElementById('boot-background-remove');

  if (!boot || !image || !video || !fileInput || !status || !removeButton) return;

  const databaseName = 'everechoes-boot-background';
  const storeName = 'media';
  const backgroundKey = 'boot-background';
  const formats = {
    '.mp4': { type: 'video/mp4', element: video },
    '.webm': { type: 'video/webm', element: video },
    '.jpg': { type: 'image/jpeg', element: image },
    '.jpeg': { type: 'image/jpeg', element: image },
    '.png': { type: 'image/png', element: image }
  };
  let databasePromise;
  let activeObjectUrl = null;

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  }

  function updateRemoveButton(isAvailable) {
    removeButton.hidden = !isAvailable;
  }

  function openDatabase() {
    if (!window.indexedDB) {
      return Promise.reject(new Error('IndexedDB is unavailable in this browser.'));
    }
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not open media storage.'));
      request.onblocked = () => reject(new Error('Media storage is blocked by another tab.'));
    });

    return databasePromise;
  }

  function saveBackground(file) {
    return openDatabase().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      transaction.objectStore(storeName).put({
        id: backgroundKey,
        blob: file,
        name: file.name,
        type: file.type
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('Could not save the background.'));
      transaction.onabort = () => reject(transaction.error || new Error('Saving the background was cancelled.'));
    }));
  }

  function readBackground() {
    return openDatabase().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const request = transaction.objectStore(storeName).get(backgroundKey);
      let record;
      request.onsuccess = () => { record = request.result; };
      request.onerror = () => reject(request.error || new Error('Could not read the saved background.'));
      transaction.oncomplete = () => resolve(record);
      transaction.onerror = () => reject(transaction.error || new Error('Could not read the saved background.'));
    }));
  }

  function deleteBackground() {
    return openDatabase().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      transaction.objectStore(storeName).delete(backgroundKey);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('Could not remove the saved background.'));
      transaction.onabort = () => reject(transaction.error || new Error('Removing the background was cancelled.'));
    }));
  }

  function getFormat(fileName, mimeType) {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    const format = formats[extension];
    if (!format) return null;
    if (mimeType && mimeType !== format.type && mimeType !== 'application/octet-stream') return null;
    return format;
  }

  function clearElement(element) {
    if (element === video) {
      element.pause();
      element.removeAttribute('src');
      element.load();
    } else {
      element.removeAttribute('src');
    }
    element.hidden = true;
  }

  function clearActiveBackground() {
    clearElement(image);
    clearElement(video);
    boot.classList.remove('has-custom-background');
    if (activeObjectUrl) {
      URL.revokeObjectURL(activeObjectUrl);
      activeObjectUrl = null;
    }
  }

  function displayBackground(blob, fileName, mimeType) {
    const format = getFormat(fileName, mimeType || blob.type);
    if (!format) {
      return Promise.reject(new Error('Choose an MP4, WebM, JPG, or PNG file.'));
    }

    const objectUrl = URL.createObjectURL(blob);
    const target = format.element;

    return new Promise((resolve, reject) => {
      let playbackBlocked = false;
      const cleanListeners = () => {
        target.removeEventListener(format.element === video ? 'loadeddata' : 'load', onLoaded);
        target.removeEventListener('error', onError);
      };
      const onError = () => {
        cleanListeners();
        URL.revokeObjectURL(objectUrl);
        clearElement(target);
        reject(new Error('The selected background could not be loaded.'));
      };
      const onLoaded = () => {
        cleanListeners();
        if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
        activeObjectUrl = objectUrl;
        image.hidden = target !== image;
        video.hidden = target !== video;
        boot.classList.add('has-custom-background');
        if (target === video) {
          const playback = target.play();
          if (playback && typeof playback.catch === 'function') {
            playback.catch(error => {
              console.warn('Loading screen background video could not autoplay:', error);
              playbackBlocked = true;
              setStatus('VIDEO SAVED / AUTOPLAY BLOCKED', true);
            });
          }
        }
        resolve({ playbackBlocked });
      };

      target.addEventListener(format.element === video ? 'loadeddata' : 'load', onLoaded, { once: true });
      target.addEventListener('error', onError, { once: true });
      target.hidden = false;
      target.src = objectUrl;
    });
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    const format = getFormat(file.name, file.type);
    if (!format) {
      setStatus('UNSUPPORTED FILE / USE MP4, WEBM, JPG, OR PNG', true);
      fileInput.value = '';
      return;
    }

    setStatus('LOADING BACKGROUND...');
    try {
      const result = await displayBackground(file, file.name, file.type);
      updateRemoveButton(true);
      try {
        await saveBackground(file);
        if (!result.playbackBlocked) setStatus(`SAVED / ${file.name}`);
      } catch (error) {
        console.error('Could not save loading screen background:', error);
        setStatus('BACKGROUND ACTIVE FOR THIS VISIT / SAVE FAILED', true);
      }
    } catch (error) {
      console.error('Could not load loading screen background:', error);
      setStatus(error.message, true);
    } finally {
      fileInput.value = '';
    }
  });

  removeButton.addEventListener('click', async () => {
    setStatus('REMOVING BACKGROUND...');
    try {
      await deleteBackground();
      clearActiveBackground();
      updateRemoveButton(false);
      setStatus('USING DEFAULT BACKGROUND');
    } catch (error) {
      console.error('Could not remove loading screen background:', error);
      setStatus('COULD NOT REMOVE SAVED BACKGROUND', true);
    }
  });

  readBackground().then(record => {
    if (!record || !record.blob) return;
    return displayBackground(record.blob, record.name, record.type).then(result => {
      updateRemoveButton(true);
      if (!result.playbackBlocked) setStatus(`SAVED / ${record.name}`);
    });
  }).catch(error => {
    console.error('Could not restore loading screen background:', error);
    setStatus('SAVED BACKGROUND COULD NOT BE RESTORED', true);
  });
})();
