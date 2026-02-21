import React from 'react';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  
  const shieldJS = `
    (function() {
      const injectShield = () => {
        let style = document.getElementById('insta-shield');
        if (!style) {
          style = document.createElement('style');
          style.id = 'insta-shield';
          document.head.appendChild(style);
        }
        
        // Base rules: NUKE REELS & ADS PERMANENTLY (Skip on profile pages)
        const segments = window.location.pathname.split('/').filter(Boolean);
        const isProfile = segments.length === 1 && !['explore', 'reels', 'direct', 'stories', 'emails'].includes(segments[0]);
        const isProfileReels = segments.length === 2 && segments[1] === 'reels';

        let css = "._ac9s, section._aa6g { display: none !important; visibility: hidden !important; }";
        if (!isProfile && !isProfileReels) {
          css += " a[href*='/reels/'], a[href*='/reel/'], div[aria-label*='Reels'] { display: none !important; visibility: hidden !important; }";
        }
        
        // Detect if user is currently searching
        const searchInput = document.querySelector('input[aria-label*="Search"]');
        const isSearching = searchInput && (document.activeElement === searchInput || searchInput.value.length > 0);

        // CLEAN SEARCH: Hide explore grid while keeping the search bar
        if (window.location.pathname.includes('/explore/')) {
          // Instead of hiding the container (which search results need), 
          // hide the specific grid items and distracting rows.
          if (!isSearching) {
            // Hide the grid articles and specific flex-row containers that hold explore posts
            css += " article, ._aabd, ._ac7v, div[style*='flex-direction: row'] { display: none !important; visibility: hidden !important; }";
            // Hide the first child of the grid container if it's the suggested posts
            css += " main > nav + div > div > div:first-child { display: none !important; }";
          }
          // Always hide the tab list (For You / Not Personalized)
          css += " div[role='tablist'] { display: none !important; }";
        }
        
        style.innerHTML = css;
      };

      const enforceStaticReel = () => {
        const path = window.location.pathname;
        // ONLY apply pinning if we are in a chat or on an actual reel page
        const isLikelyReelView = path.includes('/direct/') || path.includes('/reels/') || path.includes('/reel/');
        
        // NEVER pin on the main following feed
        const isFollowingFeed = window.location.search.includes('variant=following');

        if (isLikelyReelView && !isFollowingFeed) {
          // Look for the "Overlay" video article (modals usually have higher z-index or are children of specific containers)
          const activeVideo = document.querySelector('article video');
          if (activeVideo) {
            const rect = activeVideo.getBoundingClientRect();
            // In a chat modal, the video is almost always full-screen
            if (rect.height > window.innerHeight * 0.7) {
              const article = activeVideo.closest('article');
              if (article && article.style.position !== 'fixed') {
                article.style.setProperty('position', 'fixed', 'important');
                article.style.setProperty('top', '0', 'important');
                article.style.setProperty('z-index', '999999', 'important');
                article.style.setProperty('background', 'black', 'important');
                document.body.style.setProperty('overflow', 'hidden', 'important');
                document.body.style.setProperty('touch-action', 'none', 'important');
              }
              return;
            }
          }
        } else {
          // CLEAN UP: Ensure no main feed posts are pinned
          document.querySelectorAll('article').forEach(a => {
            if (a.style.position === 'fixed') {
              a.style.removeProperty('position');
              a.style.removeProperty('top');
              a.style.removeProperty('z-index');
              a.style.removeProperty('background');
            }
          });
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('touch-action');
        }
      };

      const nukeAds = () => {
        if (window.location.pathname.includes('/explore/')) return;
        document.querySelectorAll('article').forEach(article => {
          if (article.style.position === 'fixed') return;
          const text = article.innerText || '';
          const isAd = text.includes('Ad') || text.includes('Publicidad') || text.includes('Sponsored') || text.includes('Suggested');
          if (isAd) article.style.setProperty('display', 'none', 'important');
        });
      };

      const checkHome = () => {
        if (window.location.pathname === '/' && window.location.search === '') {
          window.location.replace('https://www.instagram.com/?variant=following');
        }
      };

      const noScroll = () => {
        if (window._scrollPatched) return;
        
        const shouldBlock = () => window.location.pathname.includes('/direct/');

        // Patch window.scrollTo
        const originalWinScrollTo = window.scrollTo;
        window.scrollTo = function() {
          if (shouldBlock()) return;
          return originalWinScrollTo.apply(this, arguments);
        };

        // Patch Element.prototype methods
        const prot = Element.prototype;
        ['scrollTo', 'scrollBy', 'scrollIntoView'].forEach(method => {
          const original = prot[method];
          prot[method] = function() {
            if (shouldBlock()) return;
            return original.apply(this, arguments);
          };
        });

        window._scrollPatched = true;
      };

      const runShield = () => {
        injectShield();
        enforceStaticReel();
        nukeAds();
        checkHome();
        noScroll();
      };

      setInterval(runShield, 400);
      runShield();

      true;
    })();
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ uri: 'https://www.instagram.com/?variant=following' }}
        style={styles.webview}
        injectedJavaScript={shieldJS}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={(event) => {}}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1" 
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 0 : 25, 
  },
  webview: {
    flex: 1,
  },
});
